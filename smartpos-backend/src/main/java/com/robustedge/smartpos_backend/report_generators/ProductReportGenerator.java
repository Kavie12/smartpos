package com.robustedge.smartpos_backend.report_generators;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.category.DefaultCategoryDataset;

import java.awt.*;
import java.io.IOException;
import java.util.List;

public class ProductReportGenerator {

    List<Object[]> products;

    public ProductReportGenerator(List<Object[]> products) {
        this.products = products;
    }

    private DefaultCategoryDataset getDataset() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (Object[] product : products) {
            dataset.addValue((Number) product[1], "Series1", (String) product[0]);
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createBarChart(
                "Products with Highest Profit",
                "Products",
                "Profit (Rs)",
                getDataset(),
                PlotOrientation.VERTICAL,
                false,
                true,
                false
        );

        // Plot background color
        CategoryPlot plot = (CategoryPlot) chart.getPlot();
        plot.setBackgroundPaint(new Color(245, 245, 245));

        // Columns styles
        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        renderer.setSeriesPaint(0, new Color(99, 136, 201));
        renderer.setMaximumBarWidth(0.1);
        plot.setRenderer(renderer);

        try {
            JFreeChartPDFGenerator.writeChartToPDF(chart, 1080, 480, filePath);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

}
