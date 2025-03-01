package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.PDFGenerators.ProductPDFGenerator;
import com.robustedge.smartpos_backend.PDFGenerators.StockRecordPDFGenerator;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void deleteProduct(Integer id) {
        repository.deleteById(id);
    }

    public void updateProduct(Product product) {
        if (product.getId() != null) {
            repository.save(product);
        }
    }

    public void generateReport() {
        List<Product> products = getAllProducts();
        String[] fields = {"ID", "Barcode", "Name", "Stock Level", "Wholesale Price", "Retail Price", "Supplier"};

        String systemUser = System.getProperty("user.name");
        String fileName = Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf";

        ProductPDFGenerator pdfGenerator = new ProductPDFGenerator(products);
        pdfGenerator.initialize(filePath);
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Products");
        pdfGenerator.addTable(fields);
        pdfGenerator.build();
    }
}
