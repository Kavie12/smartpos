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
import com.robustedge.smartpos_backend.models.Bill;
import com.robustedge.smartpos_backend.models.BillingRecord;
import com.robustedge.smartpos_backend.models.LoyaltyMember;

import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

public class ReceiptGenerator {

    private PdfFont FONT;
    private Document doc;

    private Style dividerStyles;
    private Style headerStyles;
    private Style textStyle;

    private Bill bill;

    public ReceiptGenerator(Bill bill) {
        this.bill = bill;
    }

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
            FONT = PdfFontFactory.createFont(StandardFonts.COURIER_BOLD);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load fonts", e);
        }
    }

    private void initStyles() {
        dividerStyles = new Style()
                .setFont(FONT)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER);
        headerStyles = new Style()
                .setFont(FONT)
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER);
        textStyle = new Style()
                .setFont(FONT)
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
        addStarDivider();
        doc.add(new Paragraph("SMARTPOS").addStyle(headerStyles));
        addStarDivider();

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String date = bill.getCreatedAt().format(dateTimeFormatter);

        addNormalField("Receipt ID: " + bill.getId(), date);

        addDashDivider();
    }

    public void addData() {
        // Billing records
        addSpacing(12);
        for (BillingRecord billingRecord : bill.getBillingRecords()) {
            addBillingRecord(billingRecord.getProduct().getName(), billingRecord.getQuantity(), billingRecord.getPrice());
        }

        addSpacing(12);
        addDashDivider();
        addSpacing(12);

        // Sub total
        addBoldField("Sub Total", "Rs. " + String.valueOf(bill.getTotal()));

        // Points redeemed
        if (bill.getPointsRedeemed() > 0) {
            addBoldField("Points Redeemed", String.valueOf(bill.getPointsRedeemed()));
        }

        // Total
        addBoldField("Total", "Rs. " + String.valueOf(bill.getTotal() - bill.getPointsRedeemed()));

        addSpacing(48);

        // Loyalty member details
        if (bill.getLoyaltyMember() != null) {
            LoyaltyMember loyaltyMember = bill.getLoyaltyMember();
            addBoldField("Loyalty Member ID", loyaltyMember.getPhoneNumber());
            addBoldField("Points Granted", String.valueOf(bill.getPointsGranted()));
            addBoldField("Total Points", String.valueOf(loyaltyMember.getPoints()));
        }
    }

    private void addNormalField(String left, String right) {
        Paragraph p = new Paragraph().addStyle(textStyle);
        p.add(left);
        p.add(new Tab());
        p.addTabStops(new TabStop(1000, TabAlignment.RIGHT));
        p.add(right);
        doc.add(p);
    }

    private void addBoldField(String left, String right) {
        Paragraph p = new Paragraph().addStyle(textStyle);
        p.add(left);
        p.add(new Tab());
        p.addTabStops(new TabStop(1000, TabAlignment.RIGHT));
        p.add(right);
        doc.add(p);
    }

    private void addBillingRecord(String itemName, int qty, double price) {
        addNormalField(String.valueOf(qty) + " x " + itemName, "Rs. " + String.valueOf(qty * price));
    }

    private void addSpacing(int value) {
        doc.add(new Paragraph().addStyle(new Style().setMarginTop(value)));
    }

    private void addStarDivider() {
        doc.add(new Paragraph("******************************************************").addStyle(dividerStyles));
    }

    private void addDashDivider() {
        doc.add(new Paragraph("------------------------------------------------------").addStyle(dividerStyles));
    }

    public void build() {
        addSpacing(48);
        doc.add(new Paragraph("********************* Thank You! *********************").addStyle(dividerStyles));

        doc.close();
    }
}