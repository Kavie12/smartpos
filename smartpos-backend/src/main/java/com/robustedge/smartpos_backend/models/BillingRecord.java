package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "BillingRecord")
@Table(name = "billing_records")
@Data
@NoArgsConstructor
public class BillingRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    public BillingRecord(Product product, double price, int quantity) {
        this.product = product;
        this.price = price;
        this.quantity = quantity;
    }

}
