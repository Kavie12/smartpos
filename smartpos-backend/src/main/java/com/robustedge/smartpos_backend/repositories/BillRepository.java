package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
}
