package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import com.robustedge.smartpos_backend.report_generators.EmployeeReportGenerator;
import com.robustedge.smartpos_backend.report_generators.LoyaltyMemberReportGenerator;
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
        try {
            repository.save(employee);
        } catch (DataIntegrityViolationException e) {
            throw new ApiRequestException("The phone number or email belongs to a registered employee.");
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
        if (employee.getId() != null) {
            repository.save(employee);
        }
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
