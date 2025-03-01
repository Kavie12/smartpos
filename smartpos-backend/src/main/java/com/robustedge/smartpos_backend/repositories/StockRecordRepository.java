package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.StockRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRecordRepository extends JpaRepository<StockRecord, Integer> {
}
