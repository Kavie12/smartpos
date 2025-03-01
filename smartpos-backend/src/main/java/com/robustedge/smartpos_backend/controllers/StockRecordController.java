package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.Product;
import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.services.ProductService;
import com.robustedge.smartpos_backend.services.StockRecordService;
import com.sun.tools.jconsole.JConsoleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/stock")
public class StockRecordController {

    @Autowired
    private StockRecordService service;

    @GetMapping("/get_all")
    public List<StockRecord> getAllRecords() {
        return service.getAllRecords();
    }

    @GetMapping("/get")
    public PagedModel<StockRecord> getRecords(@PageableDefault(value = 50, page = 0) Pageable pageable) {
        return service.getRecords(pageable);
    }

    @PostMapping("/add")
    public void addRecord(@RequestBody StockRecord record) {
        System.out.println(record);
        service.addRecord(record);
    }

    @DeleteMapping("/delete")
    public void deleteRecord(Integer id) {
        service.deleteRecord(id);
    }

    @PutMapping("/update")
    public void updateRecord(@RequestBody StockRecord record) {
        service.updateRecord(record);
    }

    @GetMapping("/generate_report")
    public void generateReport() {
        service.generateReport();
    }
}
