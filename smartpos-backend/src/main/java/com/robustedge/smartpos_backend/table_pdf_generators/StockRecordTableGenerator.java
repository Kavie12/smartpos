package com.robustedge.smartpos_backend.table_pdf_generators;

import com.robustedge.smartpos_backend.models.StockRecord;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class StockRecordTableGenerator extends SimplePDFTableGenerator{

    private final List<StockRecord> records;

    public StockRecordTableGenerator(List<StockRecord> records) {
        this.records = records;
    }

    @Override
    String[] getTableHeaders() {
        return new String[]{"ID", "Date", "Product", "Stock Amount"};
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> data = new ArrayList<>();

        for (StockRecord record: records) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(record.getId()));
            row.add(record.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            row.add(record.getProduct().getName());
            row.add(String.valueOf(record.getStockAmount()));

            data.add(row);
        }

        return data;
    }
}