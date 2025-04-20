package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    @Query("SELECT s FROM Supplier s WHERE s.deleted = false")
    List<Supplier> findAllActiveSuppliers();

    @Query("SELECT s FROM Supplier s WHERE s.deleted = false and (:searchKey is null or s.name like %:searchKey%)")
    Page<Supplier> findFilteredActiveSuppliers(@Param("searchKey") String searchKey, Pageable pageable);

    @Query("SELECT p.supplier.name, COUNT(p) FROM Product p WHERE p.supplier.deleted = false GROUP BY p.supplier.id ORDER BY COUNT(p) DESC LIMIT 5")
    List<Object[]> findTop5SuppliersProductCount();

}
