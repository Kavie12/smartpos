package com.robustedge.smartpos_backend.report_generators;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import org.jfree.chart.JFreeChart;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

public class JFreeChartPDFGenerator {

    public static void writeChartToPDF(JFreeChart chart, int width, int height, String pdfFilePath) throws IOException {
        BufferedImage chartImage = chart.createBufferedImage(width, height);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(chartImage, "png", baos);
        baos.flush();
        byte[] imageBytes = baos.toByteArray();
        baos.close();

        File file = new File(pdfFilePath);
        file.getParentFile().mkdirs();

        PdfWriter writer = new PdfWriter(pdfFilePath);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, new PageSize(width, height));

        Image chartImg = new Image(ImageDataFactory.create(imageBytes));
        chartImg.setFixedPosition(0, 0);
        document.add(chartImg);

        document.close();
    }

}
