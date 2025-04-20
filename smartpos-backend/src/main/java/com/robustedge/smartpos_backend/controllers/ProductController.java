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
    public PagedModel<Product> getProducts(
            @RequestParam(name = "searchKey") String searchKey,
            @PageableDefault(value = 50, page = 0) Pageable pageable
    ) {
        return service.getProducts(searchKey, pageable);
    }

    @GetMapping("/get_one")
    public Product getOne(@RequestParam(name = "productId") Integer productId) {
        return service.getOne(productId);
    }

    @GetMapping("/find_by_barcode")
    public Product findProductByBarcode(@RequestParam(name = "barcode") String barcode) {
        return service.findProductByBarcode(barcode);
    }

    @PostMapping("/add")
    public void addProduct(@RequestBody Product product) {
        service.addProduct(product);
    }

    @PutMapping("/update")
    public void updateProduct(@RequestBody Product product) {
        service.updateProduct(product);
    }

    @DeleteMapping("/delete")
    public void deleteProduct(@RequestParam(name = "productId") Integer productId) {
        service.deleteProduct(productId);
    }

    @GetMapping("/generate_report")
    public void generateReport() {
        service.generateReport();
    }

}
