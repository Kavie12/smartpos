package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.services.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int pageSize
    ) {
        return service.getBills(page, pageSize);
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

    @DeleteMapping("/delete")
    public void deleteBill(@RequestParam(name = "billId") Integer billId) {
        service.deleteBill(billId);
    }

}