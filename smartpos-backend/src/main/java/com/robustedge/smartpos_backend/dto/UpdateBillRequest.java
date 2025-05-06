package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Bill;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UpdateBillRequest {
    private Bill bill;
    private double newPaymentAmount;
}
