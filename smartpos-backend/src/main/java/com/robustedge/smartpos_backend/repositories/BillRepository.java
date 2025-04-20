package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("SELECT b FROM Bill b WHERE :searchDate IS NULL OR DATE(b.createdAt) = :searchDate")
    Page<Bill> findFilteredBills(@Param("searchDate") LocalDate searchDate, Pageable pageable);

}
