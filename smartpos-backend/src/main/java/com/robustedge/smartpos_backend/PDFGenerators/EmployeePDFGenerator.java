package com.robustedge.smartpos_backend.PDFGenerators;

import com.robustedge.smartpos_backend.models.Employee;

import java.util.ArrayList;
import java.util.List;

public class EmployeePDFGenerator extends SimplePDFTableGenerator {

    private final List<Employee> data;

    public EmployeePDFGenerator(List<Employee> data) {
        this.data = data;
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (Employee e: data) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(e.getId()));
            row.add(e.getFirstName());
            row.add(e.getLastName());
            row.add(e.getPhoneNumber());
            row.add(e.getEmail());

            tableData.add(row);
        }

        return tableData;
    }
}