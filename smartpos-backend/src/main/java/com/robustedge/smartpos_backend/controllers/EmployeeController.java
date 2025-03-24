package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @GetMapping("/get_all")
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();
    }

    @GetMapping("/get")
    public PagedModel<Employee> getEmployees(@PageableDefault(value = 50, page = 0) Pageable pageable) {
        return service.getEmployees(pageable);
    }

    @PostMapping("/add")
    public void addEmployee(@RequestBody Employee employee) {
        service.addEmployee(employee);
    }

}
