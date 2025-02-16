package com.robustedge.smartpos_backend.libraries;

import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;

import javax.swing.text.StyleConstants;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PDFGenerator<T> {

    public static final String DEST = "D:\\reports\\a.pdf";
    private List<T> list;
    private String[] fields;

    public PDFGenerator(List<T> list, String[] fields) {
        this.list = list;
        this.fields = fields;

        File file = new File(DEST);
        file.getParentFile().mkdirs();

        manipulatePdf(DEST);
    }

    private void manipulatePdf(String dest) {
        PdfDocument pdfDoc = null;
        try {
            pdfDoc = new PdfDocument(new PdfWriter(dest));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Document doc = new Document(pdfDoc);

        Table table = new Table(UnitValue.createPercentArray(fields.length)).useAllAvailableWidth();

        for (String field : fields) {
            table.addCell(new Cell().add(new Paragraph(field)));
        }

        List<List<String>> dataset = convertToString(list);
        for (List<String> record : dataset) {
            for (String field : record) {
                table.addCell(new Cell().add(new Paragraph(field)));
            }
        }

        doc.add(table);

        doc.close();
    }

    private List<List<String>> convertToString(List<T> list) {
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
