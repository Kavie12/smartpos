package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoyaltyCustomerRepository extends JpaRepository<LoyaltyCustomer, Long> {
}
