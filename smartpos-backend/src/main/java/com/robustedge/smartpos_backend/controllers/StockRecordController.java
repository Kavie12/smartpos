package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.services.StockRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedModel;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/stock_records")
public class StockRecordController {

    @Autowired
    private StockRecordService service;

    @GetMapping("/get_all")
    public List<StockRecord> getAllRecords() {
        return service.getAllRecords();
    }

    @GetMapping("/get")
    public PagedModel<StockRecord> getRecords(
            @RequestParam(name = "searchKey") String searchKey,
            @RequestParam(name = "searchDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate searchDate,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageSize", defaultValue = "50") int pageSize
    ) {
        return service.getRecords(searchKey, searchDate, page, pageSize);
    }

    @GetMapping("/get_one")
    public StockRecord getOneRecord(@RequestParam(name = "recordId") Integer recordId) {
        return service.getOneRecord(recordId);
    }

    @PostMapping("/add")
    public void addRecord(@RequestBody StockRecord record) {
        service.addRecord(record);
    }

    @PutMapping("/update")
    public void updateRecord(@RequestBody StockRecord record) {
        service.updateRecord(record);
    }

    @DeleteMapping("/delete")
    public void deleteSRecord(@RequestParam(name = "id") Integer id) {
        service.deleteRecord(id);
    }

}
