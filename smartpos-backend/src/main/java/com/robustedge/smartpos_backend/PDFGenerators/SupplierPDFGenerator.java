package com.robustedge.smartpos_backend.PDFGenerators;

import com.robustedge.smartpos_backend.models.Supplier;

import java.util.ArrayList;
import java.util.List;

public class SupplierPDFGenerator extends SimplePDFTableGenerator {

    private final List<Supplier> suppliers;

    public SupplierPDFGenerator(List<Supplier> suppliers) {
        this.suppliers = suppliers;
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