package com.robustedge.smartpos_backend.table_pdf_generators;

import com.robustedge.smartpos_backend.models.Bill;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class BillingTableGenerator extends SimplePDFTableGenerator {

    private final List<Bill> data;

    public BillingTableGenerator(List<Bill> data) {
        this.data = data;
    }

    @Override
    String[] getTableHeaders() {
        return new String[]{"ID", "Date", "Loyalty Member", "Points Granted", "Points Redeemed", "Sub Total", "Total"};
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> tableData = new ArrayList<>();

        for (Bill b: data) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(b.getId()));
            row.add(b.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

            if (b.getLoyaltyMember() != null) {
                row.add(b.getLoyaltyMember().getFirstName() + " " + b.getLoyaltyMember().getLastName());
            } else {
                row.add("-");
            }

            row.add(String.valueOf(b.getPointsGranted()));
            row.add(String.valueOf(b.getPointsRedeemed()));
            row.add("Rs. " + String.valueOf(b.getTotal()));
            row.add("Rs. " + String.valueOf(b.getTotal() - b.getPointsRedeemed()));

            tableData.add(row);
        }

        return tableData;
    }

}
