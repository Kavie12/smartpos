package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.BillingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillingRecordRepository extends JpaRepository<BillingRecord, Integer> {
}
