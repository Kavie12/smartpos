package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import com.robustedge.smartpos_backend.repositories.LoyaltyCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyCustomerService {

    private final LoyaltyCustomerRepository repository;

    @Autowired
    public LoyaltyCustomerService(LoyaltyCustomerRepository repository) {
        this.repository = repository;
    }

    public void addLoyaltyCustomer(LoyaltyCustomer loyaltyCustomer) {
        repository.save(loyaltyCustomer);
    }

    public List<LoyaltyCustomer> getLoyaltyCustomers() {
        return repository.findAll();
    }
}
