package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.models.BillingRecord;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.repositories.BillRepository;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository repository;

    @Autowired
    private ProductRepository productRepository;

    public void createBill(Bill bill) {
        for (BillingRecord record : bill.getBillingRecords()) {
            // Set current selling price
            record.setPrice(record.getProduct().getRetailPrice());

            // Deduct stock level
            Product product = record.getProduct();
            product.setStockLevel(product.getStockLevel() - record.getQuantity());
            productRepository.save(product);
        }
        repository.save(bill);
    }

    public List<Bill> getAllBills() {
        return repository.findAll();
    }

    public PagedModel<Bill> getBills(int page, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        return new PagedModel<>(repository.findAll(pageable));
    }

    public Bill getOneBill(Integer billId) {
        return repository.findById(billId).orElseThrow();
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

}
