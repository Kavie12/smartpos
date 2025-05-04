package com.robustedge.smartpos_backend.chart_pdf_generators;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.labels.StandardPieSectionLabelGenerator;
import org.jfree.chart.plot.PiePlot;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.data.general.PieDataset;

import java.awt.*;
import java.io.IOException;
import java.util.List;

public class SupplierChartGenerator {

    List<Object[]> suppliers;

    public SupplierChartGenerator(List<Object[]> suppliers) {
        this.suppliers = suppliers;
    }

    private PieDataset<String> getDataset() {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<String>();

        for (Object[] supplier : suppliers) {
            dataset.setValue((String) supplier[0], (Number) supplier[1]);
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createPieChart(
                "Supplier with Highest Product Count",
                getDataset(),
                false,
                true,
                false
        );

        // Plot styles
        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setLabelGenerator(new StandardPieSectionLabelGenerator("{0}: {1} ({2})"));
        plot.setBackgroundPaint(new Color(245, 245, 245));

        // Section colors
        Color[] colors = {
                new Color(99, 136, 201),
                new Color(99, 136, 201).brighter(),
                new Color(99, 136, 201).darker(),
                new Color(99, 136, 201).darker().darker(),
                new Color(99, 136, 201).darker().darker().darker(),
                new Color(99, 136, 201).darker().darker().darker().darker(),
        };
        String[] sections = getDataset().getKeys().toArray(new String[0]);
        for (int i = 0; i < sections.length; i++) {
            plot.setSectionPaint(sections[i], colors[i]);
        }

        try {
            JFreeChartPDFGenerator.writeChartToPDF(chart, 640, 480, filePath);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

}
