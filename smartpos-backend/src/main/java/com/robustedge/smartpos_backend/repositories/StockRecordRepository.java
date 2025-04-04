package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.StockRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRecordRepository extends JpaRepository<StockRecord, Integer> {

    @Modifying
    @Query("DELETE FROM StockRecord sr WHERE sr.product.id = :productId")
    void deleteAllByProductId(@Param("productId") Integer productId);

}
