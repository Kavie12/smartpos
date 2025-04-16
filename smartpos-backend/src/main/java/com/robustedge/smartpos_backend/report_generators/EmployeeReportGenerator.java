package com.robustedge.smartpos_backend.report_generators;

import com.robustedge.smartpos_backend.models.Employee;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class EmployeeReportGenerator {

    List<Employee> employees;

    public EmployeeReportGenerator(List<Employee> employees) {
        this.employees = employees;
    }

    private DefaultCategoryDataset getDataset() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (Employee employee : employees) {
            dataset.addValue(employee.getSalary(), employee.getFirstName() + " " + employee.getLastName(), employee.getFirstName() + " " + employee.getLastName());
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

        File barChartFile = new File(filePath);
        barChartFile.getParentFile().mkdirs();

        try {
            ChartUtils.saveChartAsJPEG(barChartFile, chart, 640, 480);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
