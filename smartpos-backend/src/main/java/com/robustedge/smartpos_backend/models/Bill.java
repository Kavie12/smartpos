package com.robustedge.smartpos_backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "Bill")
@Table(name = "bills")
@Data
@AllArgsConstructor
@NoArgsConstructor
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

    @Column(name = "points_granted")
    private double pointsGranted;

    @Column(name = "points_redeemed")
    private double pointsRedeemed;

    @Column(name = "total")
    private double total;

    @Column(name = "paidAmount")
    private double paidAmount;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Bill(List<BillingRecord> billingRecords, LoyaltyMember loyaltyMember, double pointsGranted, double pointsRedeemed, double total, double paidAmount) {
        this.billingRecords = billingRecords;
        this.loyaltyMember = loyaltyMember;
        this.pointsGranted = pointsGranted;
        this.pointsRedeemed = pointsRedeemed;
        this.total = total;
        this.paidAmount = paidAmount;
    }

}
