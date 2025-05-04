package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.chart_pdf_generators.EmployeeChartGenerator;
import com.robustedge.smartpos_backend.repositories.EmployeeRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.EmployeeTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
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
        checkUnique(employee.getPhoneNumber(), employee.getEmail());
        validateData(employee);
        repository.save(employee);
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
        validateData(employee);
        if (employee.getId() == null) {
            return;
        }
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
}
