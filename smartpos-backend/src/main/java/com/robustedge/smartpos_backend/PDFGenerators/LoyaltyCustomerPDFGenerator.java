package com.robustedge.smartpos_backend.PDFGenerators;

import com.robustedge.smartpos_backend.models.LoyaltyCustomer;

import java.util.ArrayList;
import java.util.List;

public class LoyaltyCustomerPDFGenerator extends SimplePdfTableGenerator {

    private final List<LoyaltyCustomer> data;

    public LoyaltyCustomerPDFGenerator(List<LoyaltyCustomer> data) {
        this.data = data;
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (LoyaltyCustomer c: data) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(c.getId()));
            row.add(c.getFirstName());
            row.add(c.getLastName());
            row.add(c.getPhoneNumber());
            row.add(String.valueOf(c.getPoints()));

            tableData.add(row);
        }

        return tableData;
    }
}
