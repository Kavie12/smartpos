package com.robustedge.smartpos_backend.libraries;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.Style;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class PDFGenerator<T> {

    private PdfFont fontBold;
    private PdfFont fontRegular;
    private Document doc;

    public PDFGenerator() {
    }

    public PDFGenerator<T> initialize(String dest) {
        // Create file
        File file = new File(dest);
        file.getParentFile().mkdirs();

        // Init fonts
        try {
            fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            fontRegular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load fonts", e);
        }

        // Create document
        try {
            doc = new Document(new PdfDocument(new PdfWriter(dest)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return this;
    }

    public PDFGenerator<T> addHeading(String title) {
        Style style = new Style()
                .setFont(fontBold)
                .setFontSize(20)
                .setTextAlignment(TextAlignment.CENTER)
                .setPaddingBottom(12);

        doc.add(new Paragraph(title).addStyle(style));

        return this;
    }

    public PDFGenerator<T> addTable(List<T> list, String[] tableHeaders) {
        // Create table
        Table table = new Table(UnitValue.createPercentArray(tableHeaders.length)).useAllAvailableWidth();

        // Add table headings
        for (String field : tableHeaders) {
            table.addCell(new Cell().add(new Paragraph(field).setFont(fontBold)));
        }

        // Add table data
        List<List<String>> dataset = extractData(list);
        for (List<String> record : dataset) {
            for (String field : record) {
                table.addCell(new Cell().add(new Paragraph(field).setFont(fontRegular)));
            }
        }

        doc.add(table);

        return this;
    }

    public void build() {
        doc.close();
    }

    private List<List<String>> extractData(List<T> list) {
        List<List<String>> resultList = new ArrayList<>();

        for (T item : list) {
            Field[] fields = item.getClass().getDeclaredFields();
            List<String> values = new ArrayList<>();

            for (Field field : fields) {
                field.setAccessible(true);
                try {
                    Object value = field.get(item);
                    values.add(value != null ? value.toString() : "null");
                } catch (IllegalAccessException e) {
                    values.add("error");
                }
            }

            resultList.add(values);
        }

        return resultList;
    }

}
