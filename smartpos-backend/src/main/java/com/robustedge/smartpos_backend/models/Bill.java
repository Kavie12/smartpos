package com.robustedge.smartpos_backend.models;

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

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    private List<BillingRecord> billingRecords = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "loyalty_member_id")
    private LoyaltyMember loyaltyMember;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Bill() {
    }

    public Bill(Integer id, List<BillingRecord> billingRecords, LoyaltyMember loyaltyMember, LocalDateTime createdAt) {
        this.id = id;
        this.billingRecords = billingRecords;
        this.loyaltyMember = loyaltyMember;
        this.createdAt = createdAt;
    }

    public Bill(List<BillingRecord> billingRecords, LoyaltyMember loyaltyMember) {
        this.billingRecords = billingRecords;
        this.loyaltyMember = loyaltyMember;
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

    public LoyaltyMember getLoyaltyMember() {
        return loyaltyMember;
    }

    public void setLoyaltyMember(LoyaltyMember loyaltyMember) {
        this.loyaltyMember = loyaltyMember;
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
                ", loyaltyMember=" + loyaltyMember +
                ", createdAt=" + createdAt +
                '}';
    }
}
