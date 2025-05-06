package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.chart_pdf_generators.BillingChartGenerator;
import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.dto.UpdateBillRequest;
import com.robustedge.smartpos_backend.models.*;
import com.robustedge.smartpos_backend.other_pdf_generators.ReceiptGenerator;
import com.robustedge.smartpos_backend.repositories.BillRepository;
import com.robustedge.smartpos_backend.repositories.BillingRecordRepository;
import com.robustedge.smartpos_backend.repositories.LoyaltyMemberRepository;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.BillingTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository repository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BillingRecordRepository billingRecordRepository;

    @Autowired
    private LoyaltyMemberRepository loyaltyMemberRepository;

    public void createBill(Bill bill, boolean redeemPoints) {
        // Check if stock is available for each product in the bill
        checkForSufficientStockLevel(bill.getBillingRecords());

        // Validate paid amount
        validatePaidAmount(bill);

        double total = 0;
        for (BillingRecord billingRecord: bill.getBillingRecords()) {
            // Set current selling price
            billingRecord.setPrice(billingRecord.getProduct().getRetailPrice());

            // Calculate total
            total += billingRecord.getPrice() * billingRecord.getQuantity();

            // Deduct stock level
            Product product = billingRecord.getProduct();
            product.setStockLevel(product.getStockLevel() - billingRecord.getQuantity());
            productRepository.save(product);
        }

        // Set total
        bill.setTotal(total);

        LoyaltyMember loyaltyMember = bill.getLoyaltyMember();
        if (loyaltyMember != null) {
            // Calculate points granted
            double pointsGranted = calculatePointsGranted(total);

            // Set points granted
            bill.setPointsGranted(pointsGranted);

            // set points redeemed
            bill.setPointsRedeemed(redeemPoints ? loyaltyMember.getPoints() : 0);

            // Update loyalty member points
            loyaltyMember.setPoints(redeemPoints ? pointsGranted : loyaltyMember.getPoints() + pointsGranted);
            loyaltyMemberRepository.save(loyaltyMember);
        }

        // Save bill and generate receipt
        Bill savedBill = repository.save(bill);
        generateReceipt(savedBill);
    }

    public List<Bill> getAllBills() {
        return repository.findAll();
    }

    public PagedModel<Bill> getBills(LocalDate searchDate, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        return new PagedModel<>(repository.findFilteredBills(searchDate, pageable));
    }

    public Bill getOneBill(Integer billId) {
        return repository.findById(billId).orElseThrow(() -> new ApiRequestException("Invalid bill ID."));
    }

    public void deleteBill(Integer billId) {
        Bill bill = repository.findById(billId).orElseThrow(() -> new ApiRequestException("Bill not found."));

        // Update quantity
        for (BillingRecord billingRecord : bill.getBillingRecords()) {
            Product product = billingRecord.getProduct();
            product.setStockLevel(product.getStockLevel() + billingRecord.getQuantity());
        }

        // Update loyalty member points
        LoyaltyMember loyaltyMember = bill.getLoyaltyMember();
        if (loyaltyMember != null) {
            loyaltyMember.setPoints(loyaltyMember.getPoints() + bill.getPointsRedeemed() - bill.getPointsGranted());
        }

        repository.deleteById(billId);
    }

    public void updateBill(UpdateBillRequest updateBillRequest) {
        Bill bill = updateBillRequest.getBill();
        if (bill.getId() == null) {
            return;
        }

        // Update paid amount
        bill.setPaidAmount(bill.getPaidAmount() + updateBillRequest.getNewPaymentAmount());

        // Check if stock is available for each product in the bill
        checkForSufficientStockLevel(bill.getBillingRecords());

        // Validate paid amount
        validatePaidAmount(bill);

        // Get old bill
        Bill oldBill = repository.findById(bill.getId()).orElseThrow();

        double total = 0;
        for (BillingRecord billingRecord : bill.getBillingRecords()) {
            // Calculate total
            total += billingRecord.getPrice() * billingRecord.getQuantity();

            // Update product quantity
            BillingRecord oldBillingRecord = billingRecordRepository.findById(billingRecord.getId()).orElseThrow();
            Product product = billingRecord.getProduct();
            product.setStockLevel(product.getStockLevel() + oldBillingRecord.getQuantity() - billingRecord.getQuantity());
            productRepository.save(product);
        }

        // Set total
        bill.setTotal(total);

        // Set points granted
        double pointsGranted = calculatePointsGranted(total);
        bill.setPointsGranted(pointsGranted);

        // Update loyalty member points
        LoyaltyMember loyaltyMember = bill.getLoyaltyMember();
        if (loyaltyMember != null) {
            loyaltyMember.setPoints(bill.getPointsRedeemed() > 0 ? pointsGranted : loyaltyMember.getPoints() - oldBill.getPointsGranted() + pointsGranted);
            loyaltyMemberRepository.save(loyaltyMember);
        }

        // Save bill and generate receipt
        repository.save(bill);
        generateReceipt(bill);
    }

    private void validatePaidAmount(Bill bill) {
        double paidAmount = bill.getPaidAmount();
        double total = bill.getTotal();

        if (paidAmount == 0.0) {
            throw new ApiRequestException("Please enter paid amount to proceed.");
        }

        // Allow partial payment only for loyalty members
        if (paidAmount < total) {
            if (bill.getLoyaltyMember() == null) {
                throw new ApiRequestException("Only loyalty members can pay partially. Please enter the full amount.");
            }
        }
    }

    public void printBill(Integer billId) {
        Bill bill = repository.findById(billId).orElseThrow(() -> new ApiRequestException("Bill not found."));
        generateReceipt(bill);
    }

    private void generateReceipt(Bill bill) {
        // Construct the file path
        String fileName = "receipt_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate the receipt
        ReceiptGenerator receiptGenerator = new ReceiptGenerator(bill, Utils.getReportFolderDirectory("Receipts", fileName));
        receiptGenerator.generate();
    }

    private double calculatePointsGranted(double total) {
        BigDecimal totalBD = BigDecimal.valueOf(total);
        return totalBD
                .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private void checkForSufficientStockLevel(List<BillingRecord> billingRecords) {
        for (BillingRecord billingRecord: billingRecords) {
            // Check for sufficient stock level
            Product product = billingRecord.getProduct();
            if (product.getStockLevel() < billingRecord.getQuantity()) {
                throw new ApiRequestException(product.getName() + " has no sufficient stock level.");
            }
        }
    }

    public void generateChart() {
        // Get bills
        List<Object[]> bills = repository.findTop5BillsByTotalPrice();

        // Construct the file name
        String fileName = "chart_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate report
        BillingChartGenerator reportGenerator = new BillingChartGenerator(bills);
        reportGenerator.buildChart(Utils.getReportFolderDirectory("BillingReports", fileName));
    }

    public void generateTableReport() {
        List<Bill> bills = getAllBills();

        String fileName = "table_" + Utils.getDateTimeFileName() + ".pdf";

        BillingTableGenerator pdfGenerator = new BillingTableGenerator(bills);
        pdfGenerator.initialize(Utils.getReportFolderDirectory("BillingReports", fileName));
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Bills");
        pdfGenerator.addTable();
        pdfGenerator.build();
    }
}
