package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserDetailsResponse {
    private Employee employee;
    private String username;
    private String role;
}
