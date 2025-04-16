package com.robustedge.smartpos_backend.report_generators;

import com.robustedge.smartpos_backend.models.LoyaltyMember;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class LoyaltyMemberReportGenerator {

    List<LoyaltyMember> loyaltyMembers;

    public LoyaltyMemberReportGenerator(List<LoyaltyMember> loyaltyMembers) {
        this.loyaltyMembers = loyaltyMembers;
    }

    private DefaultCategoryDataset getDataset() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (LoyaltyMember loyaltyMember : loyaltyMembers) {
            dataset.addValue(loyaltyMember.getPoints(), loyaltyMember.getFirstName() + " " + loyaltyMember.getLastName(), loyaltyMember.getFirstName() + " " + loyaltyMember.getLastName());
        }

        return dataset;
    }

    public void buildChart(String filePath) {
        JFreeChart chart = ChartFactory.createBarChart(
                "Top Loyalty Members",
                "Loyalty Member",
                "Points",
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
