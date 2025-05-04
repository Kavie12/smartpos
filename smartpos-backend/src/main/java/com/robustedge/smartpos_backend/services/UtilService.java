package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.stereotype.Service;

@Service
public class UtilService {

    public void openReportDirectory() {
        Utils.openReportDirectory();
    }
}
