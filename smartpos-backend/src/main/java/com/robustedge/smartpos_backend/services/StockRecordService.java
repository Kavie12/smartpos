package com.robustedge.smartpos_backend.services;

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

}
