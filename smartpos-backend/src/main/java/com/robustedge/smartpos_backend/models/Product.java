package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

@Entity(name = "Product")
@Table(name = "products")
@SQLDelete(sql = "UPDATE products SET deleted = true WHERE id=?")
@Data
@NoArgsConstructor
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "barcode", unique = true, length = 20)
    private String barcode;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "wholesale_price", nullable = false)
    private double wholesalePrice;

    @Column(name = "retail_price", nullable = false)
    private double retailPrice;

    @Column(name = "stock_level", nullable = false)
    private Integer stockLevel;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "deleted", nullable = false)
    private boolean deleted =  false;

    public Product(String barcode, String name, double wholesalePrice, double retailPrice, Integer stockLevel, Supplier supplier) {
        this.barcode = barcode;
        this.name = name;
        this.wholesalePrice = wholesalePrice;
        this.retailPrice = retailPrice;
        this.stockLevel = stockLevel;
        this.supplier = supplier;
    }

}
