package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.PDFGenerators.StockRecordPDFGenerator;
import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.repositories.StockRecordRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockRecordService {

    @Autowired
    private StockRecordRepository repository;

    public void addRecord(StockRecord record) {
        repository.save(record);
    }

    public List<StockRecord> getAllRecords() {
        return repository.findAll();
    }

    public PagedModel<StockRecord> getRecords(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void deleteRecord(Integer id) {
        repository.deleteById(id);
    }

    public void updateRecord(StockRecord record) {
        if (record.getId() != null) {
            repository.save(record);
        }
    }

    public void generateReport() {
        List<StockRecord> records = getAllRecords();
        String[] fields = {"ID", "Product", "Stock Amount", "Date"};

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
