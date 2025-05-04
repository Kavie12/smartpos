package com.robustedge.smartpos_backend.chart_pdf_generators;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Employee;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.category.DefaultCategoryDataset;

import java.awt.*;
import java.io.IOException;
import java.util.List;

public class EmployeeChartGenerator {

    List<Employee> employees;

    public EmployeeChartGenerator(List<Employee> employees) {
        this.employees = employees;
    }

    private DefaultCategoryDataset getDataset() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (Employee employee : employees) {
            dataset.addValue(employee.getSalary(), "Series1", employee.getFirstName() + " " + employee.getLastName());
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createBarChart(
                "Employees with Highest Salaries",
                "Employee",
                "Salary",
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
