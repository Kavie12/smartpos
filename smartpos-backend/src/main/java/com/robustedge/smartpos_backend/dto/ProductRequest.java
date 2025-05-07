package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private Product product;
    private boolean customBarcode;
}
