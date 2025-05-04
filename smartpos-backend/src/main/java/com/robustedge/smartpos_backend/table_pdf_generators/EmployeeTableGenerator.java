package com.robustedge.smartpos_backend.table_pdf_generators;

import com.robustedge.smartpos_backend.models.Employee;

import java.util.ArrayList;
import java.util.List;

public class EmployeeTableGenerator extends SimplePDFTableGenerator {

    private final List<Employee> data;

    public EmployeeTableGenerator(List<Employee> data) {
        this.data = data;
    }

    @Override
    String[] getTableHeaders() {
        return new String[]{"ID", "Name", "Phone Number", "Email", "Salary"};
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (Employee e: data) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(e.getId()));
            row.add(e.getFirstName() + " " + e.getLastName());
            row.add(e.getPhoneNumber());
            row.add(e.getEmail());
            row.add(String.valueOf(e.getSalary()));

            tableData.add(row);
        }

        return tableData;
    }
}