package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.services.LoyaltyCustomerService;
import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:5173/", allowCredentials = "true")
@RequestMapping(path = "/loyalty_customers")
public class LoyaltyCustomerController {

    private final LoyaltyCustomerService service;

    @Autowired
    public LoyaltyCustomerController(LoyaltyCustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<LoyaltyCustomer> getLoyaltyCustomers() {
        return service.getLoyaltyCustomers();
    }

    @PostMapping
    public void addLoyaltyCustomer(@RequestBody LoyaltyCustomer loyaltyCustomer) {
        service.addLoyaltyCustomer(loyaltyCustomer);
    }
}
