package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.StockRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface StockRecordRepository extends JpaRepository<StockRecord, Integer> {

    @Modifying
    @Query("DELETE FROM StockRecord sr WHERE sr.product.id = :productId")
    void deleteAllByProductId(@Param("productId") Integer productId);

    @Query("select sr from StockRecord sr where (:searchKey is null or sr.product.name like %:searchKey%) and (:searchDate is null or date(sr.createdAt) = :searchDate)")
    Page<StockRecord> findFilteredStockRecords(@Param("searchKey") String searchKey, @Param("searchDate") LocalDate searchDate, Pageable pageable);

    @Query("select sr.product.name, count(sr) as count from StockRecord sr group by sr.product.id order by count desc limit 5")
    List<Object[]> findTop5ProductsByStockRecordCount();
}
