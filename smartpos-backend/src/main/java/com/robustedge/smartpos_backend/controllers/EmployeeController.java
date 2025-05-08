package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.dto.EmployeeRequest;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/employees")
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @GetMapping("/get_all")
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();
    }

    @GetMapping("/get")
    public PagedModel<Employee> getEmployees(
            @RequestParam(name = "searchKey") String searchKey,
            @PageableDefault(value = 50, page = 0) Pageable pageable
    ) {
        return service.getEmployees(searchKey, pageable);
    }

    @GetMapping("/get_one")
    public Employee getOne(@RequestParam(name = "employeeId") Integer employeeId) {
        return service.getOne(employeeId);
    }

    @PostMapping("/add")
    public void addEmployee(@RequestBody EmployeeRequest employeeRequest) {
        service.addEmployee(employeeRequest);
    }

    @PutMapping("/update")
    public void updateEmployee(@RequestBody Employee employee) {
        service.updateEmployee(employee);
    }

    @PutMapping("/create_credentials")
    public void createCredentials(@RequestBody EmployeeRequest employeeRequest) {
        service.createCredentials(employeeRequest);
    }

    @PutMapping("/delete_credentials")
    public void deleteCredentials(@RequestParam(name = "employeeId") Integer employeeId) {
        service.deleteCredentials(employeeId);
    }

    @DeleteMapping("/delete")
    public void deleteEmployee(@RequestParam(name = "employeeId") Integer employeeId) {
        service.deleteEmployee(employeeId);
    }

    @GetMapping("/generate_chart")
    public void generateChart() {
        service.generateChart();
    }

    @GetMapping("/generate_table_report")
    public void generateTableReport() {
        service.generateTableReport();
    }
}
