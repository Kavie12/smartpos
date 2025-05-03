package com.robustedge.smartpos_backend.chart_pdf_generators;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.category.DefaultCategoryDataset;

import java.awt.*;
import java.io.IOException;
import java.util.List;

public class BillingChartGenerator {

    List<Object[]> bills;

    public BillingChartGenerator(List<Object[]> bills) {
        this.bills = bills;
    }

    private DefaultCategoryDataset getDataset() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (Object[] bill : bills) {
            dataset.addValue((Number) bill[1], "Series1", bill[0].toString());
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createBarChart(
                "Bills with Highest Amounts",
                "Bill ID",
                "Total Amount",
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
            throw new ApiRequestException("Error generating report.");
        }
    }

}
