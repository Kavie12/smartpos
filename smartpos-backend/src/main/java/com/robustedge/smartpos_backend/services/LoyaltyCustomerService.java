package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import com.robustedge.smartpos_backend.repositories.LoyaltyCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyCustomerService {

    @Autowired
    private LoyaltyCustomerRepository repository;

    public void addLoyaltyCustomer(LoyaltyCustomer loyaltyCustomer) {
        loyaltyCustomer.setPoints(0);
        repository.save(loyaltyCustomer);
    }

    public List<LoyaltyCustomer> getAllLoyaltyCustomers() {
        return repository.findAll();
    }

    public PagedModel<LoyaltyCustomer> getLoyaltyCustomers(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

}
