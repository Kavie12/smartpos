package com.robustedge.smartpos_backend.report_generators;

import com.robustedge.smartpos_backend.models.Product;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.labels.StandardPieSectionLabelGenerator;
import org.jfree.chart.plot.PiePlot;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.data.general.PieDataset;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class ProductReportGenerator {

    List<Product> products;

    public ProductReportGenerator(List<Product> products) {
        this.products = products;
    }

    private PieDataset<String> getDataset() {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<String>();

        for (Product product : products) {
            dataset.setValue(product.getName(), product.getStockLevel());
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createPieChart(
                "Products with Highest Stock Level",
                getDataset(),
                false,
                true,
                false
        );

        ((PiePlot<?>) chart.getPlot()).setLabelGenerator(new StandardPieSectionLabelGenerator("{0}: {1} ({2})"));

        File pieChartFile = new File(filePath);
        pieChartFile.getParentFile().mkdirs();

        try {
            ChartUtils.saveChartAsJPEG(pieChartFile, chart, 640, 480);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

}
