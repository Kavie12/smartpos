package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;

@Entity(name = "Product")
@Table(name = "products")
@SQLDelete(sql = "UPDATE products SET deleted = true WHERE id=?")
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "barcode", length = 20)
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

    public Product() {
    }

    public Product(Integer id, String barcode, String name, double wholesalePrice, double retailPrice, Integer stockLevel, Supplier supplier) {
        this.id = id;
        this.barcode = barcode;
        this.name = name;
        this.wholesalePrice = wholesalePrice;
        this.retailPrice = retailPrice;
        this.stockLevel = stockLevel;
        this.supplier = supplier;
    }

    public Product(String barcode, String name, double wholesalePrice, double retailPrice, Integer stockLevel, Supplier supplier) {
        this.barcode = barcode;
        this.name = name;
        this.wholesalePrice = wholesalePrice;
        this.retailPrice = retailPrice;
        this.stockLevel = stockLevel;
        this.supplier = supplier;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getWholesalePrice() {
        return wholesalePrice;
    }

    public void setWholesalePrice(double wholesalePrice) {
        this.wholesalePrice = wholesalePrice;
    }

    public double getRetailPrice() {
        return retailPrice;
    }

    public void setRetailPrice(double retailPrice) {
        this.retailPrice = retailPrice;
    }

    public Integer getStockLevel() {
        return stockLevel;
    }

    public void setStockLevel(Integer stockLevel) {
        this.stockLevel = stockLevel;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
}
