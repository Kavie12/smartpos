package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping("/get_all")
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/get")
    public PagedModel<Product> getProducts(@PageableDefault(value = 50, page = 0) Pageable pageable) {
        return service.getProducts(pageable);
    }

    @PostMapping("/add")
    public void addProduct(@RequestBody Product product) {
        service.addProduct(product);
    }

    @DeleteMapping("/delete")
    public void deleteProduct(Integer id) {
        service.deleteProduct(id);
    }

    @PutMapping("/update")
    public void updateProduct(@RequestBody Product product) {
        service.updateProduct(product);
    }

    @GetMapping("/generate_report")
    public void generateReport() {
        service.generateReport();
    }

}
