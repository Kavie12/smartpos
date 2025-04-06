package com.robustedge.smartpos_backend.services;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.Style;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TabAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.robustedge.smartpos_backend.models.BillingRecord;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class ReceiptGenerator {

    private PdfFont COURIER;
    private PdfFont COURIER_BOLD;
    private Document doc;

    private Style dividerStyles;
    private Style headerStyles;
    private Style normalTextStyle;
    private Style boldTextStyle;

    public void initialize(String dest) {
        // Create file
        File file = new File(dest);
        file.getParentFile().mkdirs();

        // Init fonts
        initFonts();

        // Init styles
        initStyles();

        // Create document
        createDocument(dest);

        // Add heading
        addHeading();
    }

    private void initFonts() {
        try {
            COURIER = PdfFontFactory.createFont(StandardFonts.COURIER);
            COURIER_BOLD = PdfFontFactory.createFont(StandardFonts.COURIER_BOLD);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load fonts", e);
        }
    }

    private void initStyles() {
        dividerStyles = new Style()
                .setFont(COURIER)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER);
        headerStyles = new Style()
                .setFont(COURIER)
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER);
        normalTextStyle = new Style()
                .setFont(COURIER)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.LEFT);
        boldTextStyle = new Style()
                .setFont(COURIER_BOLD)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.LEFT);
    }

    private void createDocument(String dest) {
        try {
            doc = new Document(new PdfDocument(new PdfWriter(dest)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void addHeading() {
        doc.add(new Paragraph("******************************************************").addStyle(dividerStyles));
        doc.add(new Paragraph("SMARTPOS").addStyle(headerStyles));
        doc.add(new Paragraph("******************************************************").addStyle(dividerStyles));

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String date = dateFormat.format(new Date());

        Paragraph p = new Paragraph("Receipt").addStyle(normalTextStyle);
        p.add(new Tab());
        p.addTabStops(new TabStop(1000, TabAlignment.RIGHT));
        p.add(date);
        doc.add(p);

        doc.add(new Paragraph("------------------------------------------------------").addStyle(dividerStyles));
    }

    public void addBillingRecords(List<BillingRecord> billingRecords) {
        double total = 0;
        doc.add(new Paragraph().addStyle(new Style().setMarginTop(12)));
        for (BillingRecord billingRecord : billingRecords) {
            doc.add(getBillingRecord(billingRecord.getProduct().getName(), billingRecord.getQuantity(), billingRecord.getPrice()));
            total += billingRecord.getQuantity() * billingRecord.getPrice();
        }
        doc.add(new Paragraph().addStyle(new Style().setMarginTop(12)));
        doc.add(new Paragraph("------------------------------------------------------").addStyle(dividerStyles));
        doc.add(new Paragraph().addStyle(new Style().setMarginTop(12)));
        doc.add(getTotal(total));
    }

    private Paragraph getBillingRecord(String itemName, int qty, double price) {
        Paragraph p = new Paragraph().addStyle(normalTextStyle);
        p.add(String.valueOf(qty) + " x " + itemName);
        p.add(new Tab());
        p.addTabStops(new TabStop(1000, TabAlignment.RIGHT));
        p.add("Rs. " + String.valueOf(qty * price));
        return p;
    }

    private Paragraph getTotal(double total) {
        Paragraph p = new Paragraph().addStyle(boldTextStyle);
        p.add("Total");
        p.add(new Tab());
        p.addTabStops(new TabStop(1000, TabAlignment.RIGHT));
        p.add("Rs. " + String.valueOf(total));
        return p;
    }

    public void build() {
        doc.add(new Paragraph().addStyle(new Style().setMarginTop(24)));
        doc.add(new Paragraph("********************* Thank You! *********************").addStyle(dividerStyles));

        doc.close();
    }

}