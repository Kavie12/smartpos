package com.robustedge.smartpos_backend.table_pdf_generators;

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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

abstract class SimplePDFTableGenerator {

    private PdfFont TIMES_ROMAN;
    private PdfFont TIMES_BOLD;
    private PdfFont HELVETICA_BOLD;
    private PdfFont COURIER;
    private Document doc;

    public void initialize(String dest) {
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
    }

    public void addMetaData() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String date = dateFormat.format(new Date());

        Style style = new Style()
                .setFont(COURIER)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.RIGHT);

        doc.add(new Paragraph("SmartPOS").addStyle(style));
        doc.add(new Paragraph(date).addStyle(style.setPaddingBottom(20)));
    }

    public void addHeading(String title) {
        Style style = new Style()
                .setFont(HELVETICA_BOLD)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setPaddingBottom(12);

        doc.add(new Paragraph(title).addStyle(style));
    }

    public void addTable() {
        String[] tableHeaders = getTableHeaders();

        // Create table
        Table table = new Table(UnitValue.createPercentArray(tableHeaders.length)).useAllAvailableWidth();

        // Add table headings
        for (String field : tableHeaders) {
            table.addCell(new Cell().add(new Paragraph(field).setFont(TIMES_BOLD)));
        }

        // Add table data
        List<List<String>> dataset = extractData();
        for (List<String> record : dataset) {
            for (String field : record) {
                table.addCell(new Cell().add(new Paragraph(field).setFont(TIMES_ROMAN)));
            }
        }

        doc.add(table);
    }

    public void build() {
        doc.close();
    }

    abstract String[] getTableHeaders();

    abstract List<List<String>> extractData();

}