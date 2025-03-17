package com.robustedge.smartpos_backend.PDFGenerators;

import com.robustedge.smartpos_backend.models.StockRecord;

import java.util.ArrayList;
import java.util.List;

public class StockRecordPDFGenerator extends SimplePdfTableGenerator{

    private final List<StockRecord> records;

    public StockRecordPDFGenerator(List<StockRecord> records) {
        this.records = records;
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> data = new ArrayList<>();

        for (StockRecord record: records) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(record.getCreatedAt()));
            row.add(record.getProduct().getName());
            row.add(String.valueOf(record.getStockAmount()));

            data.add(row);
        }

        return data;
    }
}
