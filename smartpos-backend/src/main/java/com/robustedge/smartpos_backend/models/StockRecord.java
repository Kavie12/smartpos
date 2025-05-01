package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "StockRecord")
@Table(name = "stock_records")
@Data
@NoArgsConstructor
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

    public StockRecord(Product product, Integer stockAmount) {
        this.product = product;
        this.stockAmount = stockAmount;
    }

}
