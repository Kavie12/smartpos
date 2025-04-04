package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import com.robustedge.smartpos_backend.repositories.StockRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private StockRecordRepository stockRecordRepository;

    public void addProduct(Product product) {
        try {
            repository.save(product);
        } catch (DataIntegrityViolationException e) {
            throw new ApiRequestException("A product with the same barcode is already registered.");
        }
    }

    public List<Product> getAllProducts() {
        return repository.findAllActiveProducts();
    }

    public Product getOne(Integer productId) {
        return repository.findById(productId).orElseThrow(() -> new ApiRequestException("Product not found."));
    }

    public PagedModel<Product> getProducts(Pageable pageable) {
        return new PagedModel<>(repository.findAllActiveProductPage(pageable));
    }

    public void updateProduct(Product product) {
        if (product.getId() != null) {
            repository.save(product);
        }
    }

    public Product findProductByBarcode(String barcode) {
        return repository.findByBarcode(barcode).orElseThrow(() -> new ApiRequestException("Product not found"));
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        repository.deleteById(productId);
        stockRecordRepository.deleteAllByProductId(productId);
    }
}
