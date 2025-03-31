package com.robustedge.smartpos_backend.PDFGenerators;

import com.robustedge.smartpos_backend.models.LoyaltyMember;

import java.util.ArrayList;
import java.util.List;

public class LoyaltyMemberPDFGenerator extends SimplePDFTableGenerator {

    private final List<LoyaltyMember> data;

    public LoyaltyMemberPDFGenerator(List<LoyaltyMember> data) {
        this.data = data;
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (LoyaltyMember c: data) {
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