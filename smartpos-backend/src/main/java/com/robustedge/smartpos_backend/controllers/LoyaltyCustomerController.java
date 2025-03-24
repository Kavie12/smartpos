package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.services.LoyaltyCustomerService;
import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/loyalty_customers")
public class LoyaltyCustomerController {

    @Autowired
    private LoyaltyCustomerService service;

    @GetMapping("/get_all")
    public List<LoyaltyCustomer> getAllLoyaltyCustomers() {
        return service.getAllLoyaltyCustomers();
    }

    @GetMapping("/get")
    public PagedModel<LoyaltyCustomer> getLoyaltyCustomers(@PageableDefault(value = 50, page = 0) Pageable pageable) {
        return service.getLoyaltyCustomers(pageable);
    }

    @PostMapping("/add")
    public void addLoyaltyCustomer(@RequestBody LoyaltyCustomer loyaltyCustomer) {
        service.addLoyaltyCustomer(loyaltyCustomer);
    }

}
