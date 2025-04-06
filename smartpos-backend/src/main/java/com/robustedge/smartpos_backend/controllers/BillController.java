package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.services.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedModel;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/billing")
public class BillController {

    @Autowired
    private BillService service;

    @PostMapping("create")
    public void createBill(@RequestBody Bill bill) {
        service.createBill(bill);
    }

    @GetMapping("/get")
    public PagedModel<Bill> getBills(
            @RequestParam(name = "searchDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate searchDate,
            @RequestParam(defaultValue = "0", value = "page") int page,
            @RequestParam(defaultValue = "25", value = "size") int size
    ) {
        return service.getBills(searchDate, page, size);
    }

    @GetMapping("get_all")
    public List<Bill> getAllBills() {
        return service.getAllBills();
    }

    @GetMapping("get_one")
    public Bill getOneBill(@RequestParam(name = "billId") Integer billId) {
        return service.getOneBill(billId);
    }

    @PutMapping("update")
    public void updateBill(@RequestBody Bill bill) {
        service.updateBill(bill);
    }

    @GetMapping("print")
    public void printBill(@RequestParam(name = "billId") Integer billId) {
        service.printBill(billId);
    }

    @DeleteMapping("/delete")
    public void deleteBill(@RequestParam(name = "billId") Integer billId) {
        service.deleteBill(billId);
    }

}