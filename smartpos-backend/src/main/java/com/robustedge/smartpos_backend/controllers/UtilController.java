package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.services.UtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/utils")
public class UtilController {

    @Autowired
    private UtilService service;

    @GetMapping("/open_report_dir")
    public void openReportDirectory() {
        service.openReportDirectory();
    }

}
