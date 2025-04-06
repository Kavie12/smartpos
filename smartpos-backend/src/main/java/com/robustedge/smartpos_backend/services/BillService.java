package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.models.BillingRecord;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import com.robustedge.smartpos_backend.models.Product;
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
import java.util.Optional;

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

    private final ReceiptGenerator receiptGenerator = new ReceiptGenerator();

    private void generateReceipt(List<BillingRecord> billingRecords) {
        String systemUser = System.getProperty("user.name");
        String fileName = "receipt_" + Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf";
        receiptGenerator.initialize(filePath);
        receiptGenerator.addBillingRecords(billingRecords);
        receiptGenerator.build();
    }

    public void createBill(Bill bill) {
        double total = (double) 0;
        double pointsGranted = (double) 0;
        for (BillingRecord record : bill.getBillingRecords()) {
            // Set current selling price
            record.setPrice(record.getProduct().getRetailPrice());

            // Calculate total
            total += record.getPrice() * record.getQuantity();

            // Deduct stock level
            Product product = record.getProduct();
            product.setStockLevel(product.getStockLevel() - record.getQuantity());
            productRepository.save(product);
        }

        // Update loyalty member points
        LoyaltyMember loyaltyMember = bill.getLoyaltyMember();
        if (loyaltyMember != null) {
            pointsGranted = (double) total / 1000;
            loyaltyMember.setPoints(loyaltyMember.getPoints() + pointsGranted);
            loyaltyMemberRepository.save(loyaltyMember);
        }

        generateReceipt(bill.getBillingRecords());
        repository.save(bill);
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
        Optional<Bill> bill = repository.findById(billId);
        List<BillingRecord> billingRecords = bill.orElseThrow().getBillingRecords();

        // Update quantity
        for (BillingRecord billingRecord : billingRecords) {
            Product product = billingRecord.getProduct();
            product.setStockLevel(product.getStockLevel() + billingRecord.getQuantity());
        }

        repository.deleteById(billId);
    }

    public void updateBill(Bill bill) {
        for (BillingRecord billingRecord : bill.getBillingRecords()) {
            // Update quantity
            BillingRecord oldBillingRecord = billingRecordRepository.findById(billingRecord.getId()).orElseThrow();
            Product product = billingRecord.getProduct();
            product.setStockLevel(product.getStockLevel() - billingRecord.getQuantity() + oldBillingRecord.getQuantity());
            productRepository.save(product);

            billingRecordRepository.save(billingRecord);
        }

        generateReceipt(bill.getBillingRecords());
    }

    public void printBill(Integer billId) {
        Bill bill = repository.findById(billId).orElseThrow(() -> new ApiRequestException("Bill not found."));
        generateReceipt(bill.getBillingRecords());
    }
}
