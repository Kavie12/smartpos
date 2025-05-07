package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Bill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillRequest {
    private Bill bill;
    private boolean redeemPoints;
}
