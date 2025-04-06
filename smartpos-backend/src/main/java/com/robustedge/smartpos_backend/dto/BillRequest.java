package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Bill;

public class BillRequest {
    private Bill bill;
    private boolean redeemPoints;

    public BillRequest(Bill bill, boolean redeemPoints) {
        this.bill = bill;
        this.redeemPoints = redeemPoints;
    }

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }

    public boolean isRedeemPoints() {
        return redeemPoints;
    }

    public void setRedeemPoints(boolean redeemPoints) {
        this.redeemPoints = redeemPoints;
    }
}
