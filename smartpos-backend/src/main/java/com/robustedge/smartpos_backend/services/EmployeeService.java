package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.config.UserRole;
import com.robustedge.smartpos_backend.dto.EmployeeRequest;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.chart_pdf_generators.EmployeeChartGenerator;
import com.robustedge.smartpos_backend.models.User;
import com.robustedge.smartpos_backend.repositories.EmployeeRepository;
import com.robustedge.smartpos_backend.repositories.UserRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.EmployeeTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    @Autowired
    private UserRepository userRepository;

    public void addEmployee(EmployeeRequest employeeRequest) {
        Employee employee = employeeRequest.getEmployee();

        // Check if the employee's phone number and email is unique
        checkUnique(employee.getPhoneNumber(), employee.getEmail());

        // Validate fields
        validateData(employee);

        // Save as user if it's a system user
        if (employeeRequest.isMakeSystemUser()) {
            User credentials = employeeRequest.getCredentials();

            // Validate new system user
            validateNewSystemUserCredentials(credentials);

            // Hash password
            hashPassword(credentials);

            // Set role as employee
            credentials.setRole(UserRole.EMPLOYEE);

            // Set the credentials
            employee.setUser(credentials);
        }

        // Save employee
        repository.save(employee);
    }

    private void validateNewSystemUserCredentials(User credentials) {
        if (credentials.getUsername().isEmpty()) {
            throw new ApiRequestException("Username cannot be empty.");
        } else if (credentials.getPassword().isEmpty()) {
            throw new ApiRequestException("Password cannot be empty.");
        } else if (credentials.getPassword().length() < 8) {
            throw new ApiRequestException("Password length must be at least 8 characters.");
        }
    }

    private void checkUnique(String phoneNumber, String email) {
        int noOfExistingRecords = repository.NoOfExistingRecords(phoneNumber, email);
        if (noOfExistingRecords > 0) {
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
        if (employee.getId() == null) {
            return;
        }
        validateData(employee);
        repository.save(employee);
    }

    public void generateChart() {
        // Fetch employees
        List<Employee> employees = repository.findTop5BySalary();

        // Construct the filename
        String fileName = "chart_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate report
        EmployeeChartGenerator reportGenerator = new EmployeeChartGenerator(employees);
        reportGenerator.buildChart(Utils.getReportFolderDirectory("EmployeeReports", fileName));
    }

    public void generateTableReport() {
        List<Employee> employees = getAllEmployees();

        String fileName = "table_" + Utils.getDateTimeFileName() + ".pdf";

        EmployeeTableGenerator pdfGenerator = new EmployeeTableGenerator(employees);
        pdfGenerator.initialize(Utils.getReportFolderDirectory("EmployeeReports", fileName));
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Employees");
        pdfGenerator.addTable();
        pdfGenerator.build();
    }

    public void createCredentials(EmployeeRequest employeeRequest) {
        Employee employee = employeeRequest.getEmployee();
        if (employee.getId() == null || !employeeRequest.isMakeSystemUser()) {
            return;
        }

        User credentials = employeeRequest.getCredentials();

        // Validate new credentials
        validateNewSystemUserCredentials(credentials);

        // Hash password
        hashPassword(credentials);

        // Set role as employee
        credentials.setRole(UserRole.EMPLOYEE);

        // Save credentials
        employee.setUser(credentials);
        repository.save(employee);
    }

    private void hashPassword(User credentials) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        credentials.setPassword(encoder.encode(credentials.getPassword()));
    }

    public void deleteCredentials(Integer employeeId) {
        Employee employee = getOne(employeeId);
        Integer userId = employee.getUser().getId();

        // Update user
        employee.setUser(null);
        repository.save(employee);

        // Delete credentials
        userRepository.deleteById(userId);
    }
}
