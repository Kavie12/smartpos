package com.robustedge.smartpos_backend.table_pdf_generators;

import com.robustedge.smartpos_backend.models.LoyaltyMember;

import java.util.ArrayList;
import java.util.List;

public class LoyaltyMemberTableGenerator extends SimplePDFTableGenerator {

    private final List<LoyaltyMember> data;

    public LoyaltyMemberTableGenerator(List<LoyaltyMember> data) {
        this.data = data;
    }

    @Override
    String[] getTableHeaders() {
        return new String[]{"ID", "First Name", "Phone Number", "Points"};
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (LoyaltyMember c: data) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(c.getId()));
            row.add(c.getFirstName() + " " + c.getLastName());
            row.add(c.getPhoneNumber());
            row.add(String.valueOf(c.getPoints()));

            tableData.add(row);
        }

        return tableData;
    }
}