package com.robustedge.smartpos_backend.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Utils {

    public static String getDateTimeFileName() {
        LocalDateTime myDateObj = LocalDateTime.now();
        DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        return myDateObj.format(myFormatObj);
    }

}
