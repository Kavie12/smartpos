package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.report_generators.EmployeeReportGenerator;
import com.robustedge.smartpos_backend.repositories.EmployeeRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    public void addEmployee(Employee employee) {
        validateData(employee);
        try {
            repository.save(employee);
        } catch (DataIntegrityViolationException e) {
            throw new ApiRequestException("The phone number or email belongs to a registered employee.");
        }
    }

    private void validateData(Employee employee) {
        if (employee.getFirstName().isEmpty()
                || employee.getLastName().isEmpty()
                || employee.getPhoneNumber().isEmpty()
                || employee.getEmail().isEmpty()
        ) {
            throw new ApiRequestException("Please complete all the fields.");
        }
        if (employee.getSalary() <= 0) {
            throw new ApiRequestException("Please enter a valid salary.");
        }
        if (!employee.getPhoneNumber().matches("^\\+?[0-9\\s-]{7,20}$")) {
            throw new ApiRequestException("Please enter a valid phone number.");
        }
        if (!employee.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            throw new ApiRequestException("Please enter a valid email address.");
        }
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public PagedModel<Employee> getEmployees(String searchKey, Pageable pageable) {
        return new PagedModel<>(repository.findFilteredEmployees(searchKey, pageable));
    }

    public Employee getOne(Integer employeeId) {
        return repository.findById(employeeId).orElseThrow(() -> new ApiRequestException("Employee not found."));
    }

    public void deleteEmployee(Integer employeeId) {
        repository.deleteById(employeeId);
    }

    public void updateEmployee(Employee employee) {
        validateData(employee);
        if (employee.getId() == null) {
            return;
        }
        repository.save(employee);
    }

    public void generateReport() {
        List<Employee> employees = repository.findTop5BySalary();

        String systemUser = System.getProperty("user.name");
        String fileName = "report_" + Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\EmployeeReports\\" + fileName + ".pdf";

        EmployeeReportGenerator reportGenerator = new EmployeeReportGenerator(employees);
        reportGenerator.buildChart(filePath);
    }
}
