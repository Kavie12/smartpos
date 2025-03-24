package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    public void addEmployee(Employee employee) {
        repository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public PagedModel<Employee> getEmployees(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

}
