package com.robustedge.smartpos_backend.other_pdf_generators;

import com.itextpdf.barcodes.Barcode128;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.robustedge.smartpos_backend.models.Product;

import java.io.File;
import java.io.IOException;

public class CustomBarcodeGenerator {

    private final Product product;
    private final String filePath;

    private PdfDocument pdf;
    private Document document;

    private PdfFont font;

    public CustomBarcodeGenerator(Product product, String filePath) {
        this.product = product;
        this.filePath = filePath;
    }

    public CustomBarcodeGenerator initialize() throws IOException {
        File file = new File(filePath);
        file.getParentFile().mkdirs();

        PdfWriter writer = new PdfWriter(filePath);
        pdf = new PdfDocument(writer);
        document = new Document(pdf, PageSize.A10.rotate());


        initFonts();
        document.setMargins(10, 10, 10, 10);

        return this;
    }

    private void initFonts() {
        try {
            font = PdfFontFactory.createFont(StandardFonts.COURIER);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load fonts", e);
        }
    }

    public CustomBarcodeGenerator designCustomBarcode() {
        // Product name
        Paragraph name = new Paragraph(product.getName())
                .setFont(font)
                .setFontSize(4)
                .setFontColor(ColorConstants.BLACK)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(name);

        // Add barcode
        addBarcode(product.getBarcode());

        return this;
    }

    private void addBarcode(String barcodeId) {
        // Create barcode and set code
        Barcode128 barcode = new Barcode128(pdf);
        barcode.setCode(barcodeId);

        // Add barcode to the document
        PdfFormXObject barcodeObject = barcode.createFormXObject(null, null, pdf);
        Image barcodeImage = new Image(barcodeObject)
                .setHorizontalAlignment(HorizontalAlignment.CENTER);
        document.add(barcodeImage);
    }

    public void generateBarcode() {
        document.close();
    }
}
