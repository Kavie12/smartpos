package com.robustedge.smartpos_backend.other_pdf_generators;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.BorderRadius;
import com.itextpdf.layout.properties.TextAlignment;
import com.robustedge.smartpos_backend.models.LoyaltyMember;

import java.io.File;
import java.io.IOException;
import java.net.URL;

public class LoyaltyCardGenerator {

    private final LoyaltyMember member;
    private final String filePath;

    private PdfDocument pdf;
    private Document document;

    private PdfFont font;
    private PdfFont fontBold;

    public LoyaltyCardGenerator(LoyaltyMember member, String filePath) {
        this.member = member;
        this.filePath = filePath;
    }

    public LoyaltyCardGenerator initialize() throws IOException {
        File file = new File(filePath);
        file.getParentFile().mkdirs();

        PdfWriter writer = new PdfWriter(filePath);
        pdf = new PdfDocument(writer);
        document = new Document(pdf, PageSize.A7.rotate());


        initFonts();
        document.setMargins(20, 20, 20, 20);

        return this;
    }

    private void initFonts() {
        try {
            font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load fonts", e);
        }
    }

    public LoyaltyCardGenerator designCard() {
        // Set background image
        addBackgroundImage();

        // Card Title
        Paragraph storeName = new Paragraph("Srimal Stores Loyalty Card")
                .setFont(fontBold)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.WHITE)
                .setBackgroundColor(new DeviceRgb(28, 28, 38))
                .setPadding(5)
                .setBorderRadius(new BorderRadius(5));

        // Member name
        Paragraph name = new Paragraph(member.getFirstName() + " " + member.getLastName())
                .setFont(fontBold)
                .setFontSize(18)
                .setFontColor(ColorConstants.BLACK)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20)
                .setMarginBottom(5);

        // Phone number / ID
        Paragraph id = new Paragraph("Member ID: " + member.getPhoneNumber())
                .setFont(font)
                .setFontSize(11)
                .setFontColor(ColorConstants.DARK_GRAY)
                .setTextAlignment(TextAlignment.CENTER);

        document.add(storeName);
        document.add(name);
        document.add(id);

        return this;
    }

    private void addBackgroundImage() {
        URL imageURL = getClass().getResource("/images/loyalty_card_bg.png");

        if (imageURL != null) {
            Image bgImage = new Image(ImageDataFactory.create(imageURL));

            bgImage.scaleToFit(pdf.getDefaultPageSize().getWidth(), pdf.getDefaultPageSize().getHeight());
            bgImage.setFixedPosition(0, 0);

            document.add(bgImage);
        }
    }

    public void generateCard() {
        document.close();
    }
}
