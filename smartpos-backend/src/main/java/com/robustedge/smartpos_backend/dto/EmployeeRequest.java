package com.robustedge.smartpos_backend.dto;

import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class EmployeeRequest {
    private Employee employee;
    private boolean makeSystemUser;
    private User credentials;
}
