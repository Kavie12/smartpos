package com.robustedge.smartpos_backend.PDFGenerators;

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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SimplePdfTableGenerator<T> {

    private PdfFont TIMES_ROMAN;
    private PdfFont TIMES_BOLD;
    private PdfFont HELVETICA_BOLD;
    private PdfFont COURIER;
    private Document doc;

    public SimplePdfTableGenerator<T> initialize(String dest) {
        // Create file
        File file = new File(dest);
        file.getParentFile().mkdirs();

        // Init fonts
        try {
            TIMES_ROMAN = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
            TIMES_BOLD = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
            HELVETICA_BOLD = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            COURIER = PdfFontFactory.createFont(StandardFonts.COURIER);
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

    public SimplePdfTableGenerator<T> addMetaData() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String date = dateFormat.format(new Date());

        Style style = new Style()
                .setFont(COURIER)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.RIGHT);

        doc.add(new Paragraph("SmartPOS").addStyle(style));
        doc.add(new Paragraph(date).addStyle(style.setPaddingBottom(20)));

        return this;
    }

    public SimplePdfTableGenerator<T> addHeading(String title) {
        Style style = new Style()
                .setFont(HELVETICA_BOLD)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setPaddingBottom(12);

        doc.add(new Paragraph(title).addStyle(style));

        return this;
    }

    public SimplePdfTableGenerator<T> addTable(List<T> list, String[] tableHeaders) {
        // Create table
        Table table = new Table(UnitValue.createPercentArray(tableHeaders.length)).useAllAvailableWidth();

        // Add table headings
        for (String field : tableHeaders) {
            table.addCell(new Cell().add(new Paragraph(field).setFont(TIMES_BOLD)));
        }

        // Add table data
        List<List<String>> dataset = extractData(list);
        for (List<String> record : dataset) {
            for (String field : record) {
                table.addCell(new Cell().add(new Paragraph(field).setFont(TIMES_ROMAN)));
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
