package com.robustedge.smartpos_backend.utils;

import com.robustedge.smartpos_backend.config.ApiRequestException;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Utils {

    public static String getDateTimeFileName() {
        LocalDateTime myDateObj = LocalDateTime.now();
        DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        return myDateObj.format(myFormatObj);
    }

    public static String getReportFolderDirectory(String folderName, String fileName) {
        return "C:\\Users\\" + System.getProperty("user.name") + "\\Documents\\SmartPOS\\" + folderName + "\\" + fileName;
    }

    public static void openReportDirectory() {
        String folder = "C:\\Users\\" + System.getProperty("user.name") + "\\Documents\\SmartPOS";

        // Check if the folder exists
        File dir = new File(folder);
        if (!dir.exists() || !dir.isDirectory()) {
            throw new ApiRequestException("Invalid folder path.");
        }

        // Open the folder
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("explorer.exe", folder);
            processBuilder.start();
        } catch (IOException e) {
            throw new ApiRequestException("Error opening folder: " + e.getMessage());
        }
    }
}
