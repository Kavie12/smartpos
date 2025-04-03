package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.repositories.StockRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockRecordService {

    @Autowired
    private StockRecordRepository repository;

    @Autowired
    private ProductService productService;

    public void addRecord(StockRecord record) {
        // Change stock level of the product
        Product product = record.getProduct();
        product.setStockLevel(product.getStockLevel() + record.getStockAmount());
        productService.updateProduct(product);

        repository.save(record);
    }

    public List<StockRecord> getAllRecords() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public PagedModel<StockRecord> getRecords(int page, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void deleteRecord(Integer id) {
        // Get the existing record
        StockRecord record = repository.findById(id).orElseThrow();

        // Deduct stock amount of the relevant product
        Product product = record.getProduct();
        product.setStockLevel(product.getStockLevel() - record.getStockAmount());
        productService.updateProduct(product);

        repository.deleteById(id);
    }

    public void updateRecord(StockRecord newRecord) {
        // Get the existing record
        StockRecord oldRecord = repository.findById(newRecord.getId()).orElseThrow();

        // Change stock level of the product
        Product product = oldRecord.getProduct();
        product.setStockLevel(product.getStockLevel() - oldRecord.getStockAmount() + newRecord.getStockAmount());
        productService.updateProduct(product);

        repository.save(newRecord);
    }

    public StockRecord getOneRecord(Integer recordId) {
        return repository.findById(recordId).orElseThrow(() -> new ApiRequestException("Invalid Stock Record Id."));
    }
}
