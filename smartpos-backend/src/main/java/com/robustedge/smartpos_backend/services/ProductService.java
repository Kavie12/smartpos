package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    public void addProduct(Product product) {
        repository.save(product);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public PagedModel<Product> getProducts(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void updateProduct(Product product) {
        if (product.getId() != null) {
            repository.save(product);
        }
    }

    public Product findProductByBarcode(String barcode) {
        Optional<Product> product = repository.findByBarcode(barcode);
        return product.orElse(null);
    }

    public void deleteProduct(Integer productId) {
        repository.deleteById(productId);
    }
}
