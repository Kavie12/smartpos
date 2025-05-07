package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.dto.ProductRequest;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.chart_pdf_generators.ProductChartGenerator;
import com.robustedge.smartpos_backend.other_pdf_generators.CustomBarcodeGenerator;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import com.robustedge.smartpos_backend.repositories.StockRecordRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.ProductTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Random;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private StockRecordRepository stockRecordRepository;

    public void addProduct(ProductRequest productRequest) {
        Product product = productRequest.getProduct();

        // Validate
        checkUnique(product.getBarcode());
        validateData(product);

        // Generate barcode pdf if it's a custom barcode
        if (productRequest.isCustomBarcode()) {
            product.setCustomBarcode(true);
            generateBarcodePDF(product);
        }

        // Save product
        repository.save(product);
    }

    private void checkUnique(String barcode) {
        int noOfExistingRecords = repository.NoOfExistingRecords(barcode);
        if (noOfExistingRecords > 0) {
            throw new ApiRequestException("A product with the same barcode is already registered.");
        }
    }

    private void validateData(Product product) {
        if (product.getBarcode().isEmpty()
                || product.getSupplier() == null
                || product.getName().isEmpty()
        ) {
            throw new ApiRequestException("Please complete all the fields.");
        }
        if (product.getWholesalePrice() <= 0) {
            throw new ApiRequestException("Please enter a valid wholesale price.");
        }
        if (product.getRetailPrice() <= 0) {
            throw new ApiRequestException("Please enter a valid retail price.");
        }
    }

    public List<Product> getAllProducts() {
        return repository.findAllActiveProducts();
    }

    public Product getOne(Integer productId) {
        return repository.findById(productId).orElseThrow(() -> new ApiRequestException("Product not found."));
    }

    public PagedModel<Product> getProducts(String searchKey, Pageable pageable) {
        return new PagedModel<>(repository.findFilteredActiveProducts(searchKey, pageable));
    }

    public void updateProduct(Product product) {
        if (product.getId() == null) {
            return;
        }
        validateData(product);
        repository.save(product);
    }

    public Product findProductByBarcode(String barcode) {
        return repository.findByBarcode(barcode).orElseThrow(() -> new ApiRequestException("Product not found"));
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        repository.deleteById(productId);
        stockRecordRepository.deleteAllByProductId(productId);
    }

    public void generateChart() {
        // Fetch products
        List<Object[]> products = repository.findTop5ProductsByProfit();

        // Construct the file name
        String fileName = "chart_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate report
        ProductChartGenerator reportGenerator = new ProductChartGenerator(products);
        reportGenerator.buildChart(Utils.getReportFolderDirectory("ProductReports", fileName));
    }

    public void generateTableReport() {
        List<Product> products = getAllProducts();

        String fileName = "table_" + Utils.getDateTimeFileName() + ".pdf";

        ProductTableGenerator pdfGenerator = new ProductTableGenerator(products);
        pdfGenerator.initialize(Utils.getReportFolderDirectory("ProductReports", fileName));
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Products");
        pdfGenerator.addTable();
        pdfGenerator.build();
    }

    public String fetchCustomBarcode() {
        Random random = new Random();
        long min = 100000000000L;
        long max = 999999999999L;
        long randomNumber = min + (long) (random.nextDouble() * (max - min + 1));
        return String.valueOf(randomNumber);
    }

    private void generateBarcodePDF(Product product) {
        String fileName = "barcode_" + product.getBarcode() + ".pdf";
        CustomBarcodeGenerator customBarcodeGenerator = new CustomBarcodeGenerator(product, Utils.getReportFolderDirectory("CustomBarcodes", fileName));
        try {
            customBarcodeGenerator
                    .initialize()
                    .designCustomBarcode()
                    .generateBarcode();
        } catch (IOException e) {
            throw new ApiRequestException("Error generating loyalty card.");
        }
    }

    public void generateCustomBarcodePDF(Integer productId) {
        Product product = repository.findById(productId).orElseThrow();
        generateBarcodePDF(product);
    }
}
