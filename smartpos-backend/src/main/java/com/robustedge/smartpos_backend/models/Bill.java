package com.robustedge.smartpos_backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "Bill")
@Table(name = "bills")
public class Bill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @JsonManagedReference
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    private List<BillingRecord> billingRecords = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "loyalty_customer_id")
    private LoyaltyCustomer loyaltyCustomer;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Bill() {
    }

    public Bill(Integer id, List<BillingRecord> billingRecords, LoyaltyCustomer loyaltyCustomer, LocalDateTime createdAt) {
        this.id = id;
        this.billingRecords = billingRecords;
        this.loyaltyCustomer = loyaltyCustomer;
        this.createdAt = createdAt;
    }

    public Bill(List<BillingRecord> billingRecords, LoyaltyCustomer loyaltyCustomer) {
        this.billingRecords = billingRecords;
        this.loyaltyCustomer = loyaltyCustomer;
    }

    public Bill(List<BillingRecord> billingRecords) {
        this.billingRecords = billingRecords;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<BillingRecord> getBillingRecords() {
        return billingRecords;
    }

    public void setBillingRecords(List<BillingRecord> billingRecords) {
        this.billingRecords = billingRecords;
    }

    public LoyaltyCustomer getLoyaltyCustomer() {
        return loyaltyCustomer;
    }

    public void setLoyaltyCustomer(LoyaltyCustomer loyaltyCustomer) {
        this.loyaltyCustomer = loyaltyCustomer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Bill{" +
                "id=" + id +
                ", billingRecords=" + billingRecords +
                ", loyaltyCustomer=" + loyaltyCustomer +
                ", createdAt=" + createdAt +
                '}';
    }
}
