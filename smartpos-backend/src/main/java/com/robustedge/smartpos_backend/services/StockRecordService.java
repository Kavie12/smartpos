package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.chart_pdf_generators.StockRecordChartGenerator;
import com.robustedge.smartpos_backend.repositories.ProductRepository;
import com.robustedge.smartpos_backend.repositories.StockRecordRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.StockRecordTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class StockRecordService {

    @Autowired
    private StockRecordRepository repository;

    @Autowired
    private ProductRepository productRepository;

    public void addRecord(StockRecord record) {
        validateData(record);

        // Change stock level of the product
        Product product = record.getProduct();
        product.setStockLevel(product.getStockLevel() + record.getStockAmount());
        productRepository.save(product);

        repository.save(record);
    }

    private void validateData(StockRecord stockRecord) {
        if (stockRecord.getProduct() == null) {
            throw new ApiRequestException("Please select a product.");
        }
        if (stockRecord.getStockAmount() == null || stockRecord.getStockAmount() <= 0) {
            throw new ApiRequestException("Please enter a valid stock amount.");
        }
    }

    public List<StockRecord> getAllRecords() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public PagedModel<StockRecord> getRecords(String searchKey, LocalDate searchDate, int page, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        return new PagedModel<>(repository.findFilteredStockRecords(searchKey, searchDate, pageable));
    }

    public void deleteRecord(Integer id) {
        // Get the existing record
        StockRecord record = repository.findById(id).orElseThrow();

        // Deduct stock amount of the relevant product
        Product product = record.getProduct();
        product.setStockLevel(product.getStockLevel() - record.getStockAmount());
        productRepository.save(product);

        repository.deleteById(id);
    }

    public void updateRecord(StockRecord newRecord) {
        validateData(newRecord);

        // Get the existing record
        StockRecord oldRecord = repository.findById(newRecord.getId()).orElseThrow();

        Product oldProduct = oldRecord.getProduct();
        Product newProduct = newRecord.getProduct();

        // Change stock level of the product
        if (Objects.equals(oldProduct.getId(), newProduct.getId())) {
            // If product is not changed
            oldProduct.setStockLevel(oldProduct.getStockLevel() - oldRecord.getStockAmount() + newRecord.getStockAmount());
            productRepository.save(oldProduct);
        } else {
            // If product is changed
            oldProduct.setStockLevel(oldProduct.getStockLevel() - oldRecord.getStockAmount());
            newProduct.setStockLevel(newProduct.getStockLevel() + newRecord.getStockAmount());
            productRepository.save(oldProduct);
            productRepository.save(newProduct);
        }

        repository.save(newRecord);
    }

    public StockRecord getOneRecord(Integer recordId) {
        return repository.findById(recordId).orElseThrow(() -> new ApiRequestException("Invalid Stock Record Id."));
    }

    public void generateChart() {
        // Fetch stock records
        List<Object[]> products = repository.findTop5ProductsByStockRecordCount();

        // Construct the file name
        String fileName = "chart_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate report
        StockRecordChartGenerator reportGenerator = new StockRecordChartGenerator(products);
        reportGenerator.buildChart(Utils.getReportFolderDirectory("StockRecordReports", fileName));
    }

    public void generateTableReport() {
        List<StockRecord> records = getAllRecords();

        String fileName = "table_" + Utils.getDateTimeFileName() + ".pdf";

        StockRecordTableGenerator pdfGenerator = new StockRecordTableGenerator(records);
        pdfGenerator.initialize(Utils.getReportFolderDirectory("StockRecordReports", fileName));
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Stock Records");
        pdfGenerator.addTable();
        pdfGenerator.build();
    }

    public PagedModel<Product> getLowStockProducts(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return new PagedModel<>(productRepository.findLowStockProducts(pageable));
    }
}
