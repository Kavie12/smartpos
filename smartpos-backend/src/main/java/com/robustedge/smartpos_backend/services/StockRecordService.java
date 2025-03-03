package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.PDFGenerators.StockRecordPDFGenerator;
import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.repositories.StockRecordRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void deleteRecord(Integer id) {
        Optional<StockRecord> record = repository.findById(id);
        if (record.isEmpty()) {
            return;
        }
        Product product = record.get().getProduct();
        product.setStockLevel(product.getStockLevel() - record.get().getStockAmount());
        productService.updateProduct(product);
        repository.deleteById(id);
    }

    public void updateRecord(StockRecord record) {
        Optional<StockRecord> originalRecord = repository.findById(record.getId());
        if (originalRecord.isEmpty()) {
            return;
        }
        Product product = record.getProduct();
        Integer toAdd = record.getStockAmount() - originalRecord.get().getStockAmount();
        product.setStockLevel(product.getStockLevel() + toAdd);
        productService.updateProduct(product);
        repository.save(record);
    }

    public void generateReport() {
        List<StockRecord> records = getAllRecords();
        String[] fields = {"Date", "Product", "Stock Amount"};

        String systemUser = System.getProperty("user.name");
        String fileName = Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf";

        StockRecordPDFGenerator pdfGenerator = new StockRecordPDFGenerator(records);
        pdfGenerator.initialize(filePath);
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Stock Records");
        pdfGenerator.addTable(fields);
        pdfGenerator.build();
    }

}
