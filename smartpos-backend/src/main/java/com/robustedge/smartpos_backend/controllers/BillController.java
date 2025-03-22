package com.robustedge.smartpos_backend.controllers;


import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.services.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

}
