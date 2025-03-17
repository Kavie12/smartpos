package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
}
