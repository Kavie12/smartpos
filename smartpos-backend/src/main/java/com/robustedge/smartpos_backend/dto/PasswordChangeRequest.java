package com.robustedge.smartpos_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordChangeRequest {
    private String username;
    private String oldPassword;
    private String newPassword;
}
