package com.robustedge.smartpos_backend.report_generators;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.labels.StandardPieSectionLabelGenerator;
import org.jfree.chart.plot.PiePlot;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.data.general.PieDataset;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.util.List;

public class StockRecordReportGenerator {

    List<Object[]> products;

    public StockRecordReportGenerator(List<Object[]> products) {
        this.products = products;
    }

    private PieDataset<String> getDataset() {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<String>();

        for (Object[] product : products) {
            dataset.setValue((String) product[0], (Number) product[1]);
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createPieChart(
                "Products with Highest Number of Stock Records",
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

        File pieChartFile = new File(filePath);
        pieChartFile.getParentFile().mkdirs();

        try {
            ChartUtils.saveChartAsJPEG(pieChartFile, chart, 640, 480);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

}
