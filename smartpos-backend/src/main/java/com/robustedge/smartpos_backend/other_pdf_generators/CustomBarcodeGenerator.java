package com.robustedge.smartpos_backend.other_pdf_generators;

import com.itextpdf.barcodes.Barcode128;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.BorderRadius;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.robustedge.smartpos_backend.models.Product;

import java.io.File;
import java.io.IOException;
import java.net.URL;



public class CustomBarcodeGenerator {

    private final Product product;
    private final String filePath;

    private PdfDocument pdf;
    private Document document;

    private PdfFont font;
    private PdfFont fontBold;

    public CustomBarcodeGenerator(Product product, String filePath) {
        this.product = product;
        this.filePath = filePath;
    }

    public CustomBarcodeGenerator initialize() throws IOException {
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

    public CustomBarcodeGenerator designCustomBarcode() {
//        // Set background image
//        addBackgroundImage();

        // Card Title
        Paragraph storeName = new Paragraph("Product Barcode(CUSTOM)")
                .setFont(fontBold)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.WHITE)
                .setBackgroundColor(new DeviceRgb(28, 28, 38))
                .setPadding(5)
                .setBorderRadius(new BorderRadius(5));

        // Member name
        Paragraph name = new Paragraph(  "Product Name: " + product.getName())
                .setFont(font)
                .setFontSize(12)
                .setFontColor(ColorConstants.BLACK)
                .setTextAlignment(TextAlignment.LEFT)
                .setMarginTop(16)
                .setMarginBottom(5);

        // Product Name / ID
        Paragraph id = new Paragraph("Product ID: " + product.getId())
                .setFont(font)
                .setFontSize(12)
                .setFontColor(ColorConstants.BLACK)
                .setTextAlignment(TextAlignment.LEFT);

        document.add(storeName);
        document.add(name);
        document.add(id);

        // Add barcode
        addBarcode(product.getId());

        return this;
    }

//    private void addBackgroundImage() {
//        URL imageURL = getClass().getResource("/images/loyalty_card_bg.png");
//
//        if (imageURL != null) {
//            Image bgImage = new Image(ImageDataFactory.create(imageURL));
//
//            bgImage.scaleToFit(pdf.getDefaultPageSize().getWidth(), pdf.getDefaultPageSize().getHeight());
//            bgImage.setFixedPosition(0, 0);
//
//            document.add(bgImage);
//        }
//    }

    private void addBarcode(Integer id) {
        // Create barcode and set code
        Barcode128 barcode = new Barcode128(pdf);
        barcode.setCode(Integer.toString(id));

        // Add barcode to the document
        PdfFormXObject barcodeObject = barcode.createFormXObject(null, null, pdf);
        Image barcodeImage = new Image(barcodeObject)
                .setHorizontalAlignment(HorizontalAlignment.CENTER)
                .setMarginTop(12);
        document.add(barcodeImage);
    }

    public void generateBarcode() {
        document.close();
    }
}
