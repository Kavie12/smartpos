package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.barcode = :barcode AND p.deleted = false")
    Optional<Product> findByBarcode(@Param("barcode") String barcode);

    @Query("SELECT p FROM Product p WHERE p.deleted = false")
    List<Product> findAllActiveProducts();

    @Query("SELECT p FROM Product p WHERE p.deleted = false AND (:searchKey IS NULL OR p.barcode LIKE %:searchKey% OR p.name LIKE %:searchKey% OR p.supplier.name LIKE %:searchKey%)")
    Page<Product> findFilteredActiveProducts(@Param("searchKey") String searchKey, Pageable pageable);

    @Query("SELECT p.name, (p.retailPrice - p.wholesalePrice) AS profit FROM Product p WHERE p.deleted = false ORDER BY profit DESC LIMIT 5")
    List<Object[]> findTop5ProductsByProfit();

    @Query("SELECT COUNT(*) FROM Product p WHERE p.deleted = false AND p.barcode = :barcode")
    int NoOfExistingRecords(@Param("barcode") String barcode);
}
