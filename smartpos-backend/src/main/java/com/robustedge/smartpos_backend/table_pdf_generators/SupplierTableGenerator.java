package com.robustedge.smartpos_backend.table_pdf_generators;

import com.robustedge.smartpos_backend.models.Supplier;

import java.util.ArrayList;
import java.util.List;

public class SupplierTableGenerator extends SimplePDFTableGenerator {

    private final List<Supplier> suppliers;

    public SupplierTableGenerator(List<Supplier> suppliers) {
        this.suppliers = suppliers;
    }

    @Override
    String[] getTableHeaders() {
        return new String[]{"ID", "Name", "Phone Number", "Email"};
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (Supplier s: suppliers) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(s.getId()));
            row.add(s.getName());
            row.add(s.getPhoneNumber());
            row.add(s.getEmail());

            tableData.add(row);
        }

        return tableData;
    }
}