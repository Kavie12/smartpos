package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthObjectResponse {
    private Employee employee;
    private String username;
    private String role;
    private String token;
}
