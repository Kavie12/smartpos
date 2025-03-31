package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.StockRecord;
import com.robustedge.smartpos_backend.services.StockRecordService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public PagedModel<StockRecord> getRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize
    ) {
        return service.getRecords(page, pageSize);
    }

    @PostMapping("/add")
    public void addRecord(@RequestBody StockRecord record) {
        service.addRecord(record);
    }

    @DeleteMapping("/delete")
    public void deleteSRecord(@RequestParam(name = "id") Integer id) {
        service.deleteRecord(id);
    }

}
