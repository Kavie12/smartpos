package com.robustedge.smartpos_backend.PDFGenerators;

import com.robustedge.smartpos_backend.models.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductPDFGenerator extends SimplePDFTableGenerator {

    private final List<Product> products;

    public ProductPDFGenerator(List<Product> products) {
        this.products = products;
    }

    @Override
    List<List<String>> extractData() {
        List<List<String>> data = new ArrayList<>();

        for (Product p: products) {
            List<String> row = new ArrayList<>();

            row.add(String.valueOf(p.getId()));
            row.add(p.getBarcode());
            row.add(p.getName());
            row.add(String.valueOf(p.getStockLevel()));
            row.add(String.valueOf(p.getWholesalePrice()));
            row.add(String.valueOf(p.getRetailPrice()));
            row.add(p.getSupplier().getName());

            data.add(row);
        }

        return data;
    }
}