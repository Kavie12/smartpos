package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.services.LoyaltyCustomerService;
import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:5173/", allowCredentials = "true")
@RequestMapping(path = "/loyalty_customers")
public class LoyaltyCustomerController {

    @Autowired
    private LoyaltyCustomerService service;

    @GetMapping(path = "/get")
    public List<LoyaltyCustomer> getLoyaltyCustomers() {
        return service.getLoyaltyCustomers();
    }

    @PostMapping(path = "/add")
    public void addLoyaltyCustomer(@RequestBody LoyaltyCustomer loyaltyCustomer) {
        service.addLoyaltyCustomer(loyaltyCustomer);
    }

    @GetMapping(path = "generate_report")
    public void generateReport() {
        service.generateReport();
    }

}
