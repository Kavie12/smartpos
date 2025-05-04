package com.robustedge.smartpos_backend.table_pdf_generators;

import com.robustedge.smartpos_backend.models.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductTableGenerator extends SimplePDFTableGenerator {

    private final List<Product> products;

    public ProductTableGenerator(List<Product> products) {
        this.products = products;
    }

    @Override
    String[] getTableHeaders() {
        return new String[]{"ID", "Barcode", "Name", "Supplier", "Stock Level", "Wholesale Price (Rs.)", "Retail Price (Rs.)"};
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> data = new ArrayList<>();

        for (Product p: products) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(p.getId()));
            row.add(p.getBarcode());
            row.add(p.getName());
            row.add(p.getSupplier().getName());
            row.add(String.valueOf(p.getStockLevel()));
            row.add(String.valueOf(p.getWholesalePrice()));
            row.add(String.valueOf(p.getRetailPrice()));

            data.add(row);
        }

        return data;
    }
}