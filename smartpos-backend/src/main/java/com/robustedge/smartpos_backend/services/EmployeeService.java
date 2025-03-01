package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.PDFGenerators.SimplePdfTableGenerator;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.repositories.EmployeeRepository;
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
        repository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public PagedModel<Employee> getEmployees(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void deleteEmployee(Integer id) {
        repository.deleteById(id);
    }

    public void updateEmployee(Employee employee) {
        if (employee.getId() != null) {
            repository.save(employee);
        }
    }

    public void generateReport() {
        List<Employee> employees = getAllEmployees();
        String[] fields = {"ID", "First Name", "Last Name", "Phone Number", "Email"};

        String systemUser = System.getProperty("user.name");
        String fileName = Utils.getDateTimeFileName();

        SimplePdfTableGenerator<Employee> simplePdfTableGenerator = new SimplePdfTableGenerator<Employee>();
        simplePdfTableGenerator
                .initialize("C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf")
                .addMetaData()
                .addHeading("Employees")
                .addTable(employees, fields)
                .build();
    }

}
