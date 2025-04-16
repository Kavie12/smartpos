package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.models.BillingRecord;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.report_generators.ReceiptGenerator;
import com.robustedge.smartpos_backend.repositories.BillRepository;
import com.robustedge.smartpos_backend.repositories.BillingRecordRepository;
import com.robustedge.smartpos_backend.repositories.LoyaltyMemberRepository;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

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
        checkForSufficientStockLevel(bill.getBillingRecords());

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
            double pointsGranted = calculatePointsGranted(total, bill.getBillingRecords());

            // Set points granted
            bill.setPointsGranted(pointsGranted);

            // set points redeemed
            bill.setPointsRedeemed(redeemPoints ? loyaltyMember.getPoints() : 0);

            // Update loyalty member points
            loyaltyMember.setPoints(redeemPoints ? pointsGranted : loyaltyMember.getPoints() + pointsGranted);
            loyaltyMemberRepository.save(loyaltyMember);
        }

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
        loyaltyMember.setPoints(loyaltyMember.getPoints() + bill.getPointsRedeemed() - bill.getPointsGranted());

        repository.deleteById(billId);
    }

    public void updateBill(Bill bill) {
        if (bill.getId() == null) {
            return;
        }

        checkForSufficientStockLevel(bill.getBillingRecords());

        double total = 0;
        for (BillingRecord billingRecord : bill.getBillingRecords()) {
            // Calculate total
            total += billingRecord.getPrice() * billingRecord.getQuantity();

            // Update product quantity
            BillingRecord oldBillingRecord = billingRecordRepository.findById(billingRecord.getId()).orElseThrow();
            Product product = billingRecord.getProduct();
            product.setStockLevel(product.getStockLevel() - billingRecord.getQuantity() + oldBillingRecord.getQuantity());
            productRepository.save(product);
        }

        // Set total
        bill.setTotal(total);

        // Set points granted
        double pointsGranted = calculatePointsGranted(total, bill.getBillingRecords());
        bill.setPointsGranted(pointsGranted);

        // Update loyalty member points
        LoyaltyMember loyaltyMember = bill.getLoyaltyMember();
        loyaltyMember.setPoints(bill.getPointsRedeemed() > 0 ? pointsGranted : loyaltyMember.getPoints() + pointsGranted);
        loyaltyMemberRepository.save(loyaltyMember);

        repository.save(bill);
        generateReceipt(bill);
    }

    public void printBill(Integer billId) {
        Bill bill = repository.findById(billId).orElseThrow(() -> new ApiRequestException("Bill not found."));
        generateReceipt(bill);
    }

    private void generateReceipt(Bill bill) {
        String systemUser = System.getProperty("user.name");
        String fileName = "receipt_" + Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\Receipts\\" + fileName + ".pdf";

        ReceiptGenerator receiptGenerator = new ReceiptGenerator(bill, filePath);
        receiptGenerator.generate();
    }

    private double calculatePointsGranted(double total, List<BillingRecord> billingRecords) {
        return (double) Math.round(total / 1000 * 100) / 100;
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
}
