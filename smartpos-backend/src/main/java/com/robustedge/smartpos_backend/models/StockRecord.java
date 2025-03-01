package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "StockRecord")
@Table(name = "stock_records")
public class StockRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "stock_amount", nullable = false)
    private Integer stockAmount;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    public StockRecord() {
    }

    public StockRecord(Integer id, Product product, Integer stockAmount, LocalDateTime createdAt) {
        this.id = id;
        this.product = product;
        this.stockAmount = stockAmount;
        this.createdAt = createdAt;
    }

    public StockRecord(Product product, Integer stockAmount) {
        this.product = product;
        this.stockAmount = stockAmount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getStockAmount() {
        return stockAmount;
    }

    public void setStockAmount(Integer stockAmount) {
        this.stockAmount = stockAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
