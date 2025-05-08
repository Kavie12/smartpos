package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.LoyaltyMember;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoyaltyMemberRequest {
    private LoyaltyMember loyaltyMember;
    private boolean generateCard;
}
