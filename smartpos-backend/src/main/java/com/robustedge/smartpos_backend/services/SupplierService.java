package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Supplier;
import com.robustedge.smartpos_backend.chart_pdf_generators.SupplierChartGenerator;
import com.robustedge.smartpos_backend.repositories.SupplierRepository;
import com.robustedge.smartpos_backend.table_pdf_generators.SupplierTableGenerator;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository repository;

    public void addSupplier(Supplier supplier) {
        checkUnique(supplier.getPhoneNumber(), supplier.getEmail());
        validateData(supplier);
        repository.save(supplier);
    }

    private void checkUnique(String phoneNumber, String email) {
        int noOfExistingRecords = repository.NoOfExistingRecords(phoneNumber, email);
        if (noOfExistingRecords > 0) {
            throw new ApiRequestException("The phone number or email belongs to a registered supplier.");
        }
    }

    private void validateData(Supplier supplier) {
        if (supplier.getName().isEmpty()
                || supplier.getPhoneNumber().isEmpty()
                || supplier.getEmail().isEmpty()
        ) {
            throw new ApiRequestException("Please complete all the fields.");
        }
        if (!supplier.getPhoneNumber().matches("^\\+?[0-9\\s-]{7,20}$")) {
            throw new ApiRequestException("Please enter a valid phone number.");
        }
        if (!supplier.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            throw new ApiRequestException("Please enter a valid email address.");
        }
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAllActiveSuppliers();
    }

    public PagedModel<Supplier> getSuppliers(String searchKey, Pageable pageable) {
        return new PagedModel<>(repository.findFilteredActiveSuppliers(searchKey, pageable));
    }

    public Supplier getOne(Integer supplierId) {
        return repository.findById(supplierId).orElseThrow(() -> new ApiRequestException("Supplier not found."));
    }

    public void updateSupplier(Supplier supplier) {
        validateData(supplier);
        if (supplier.getId() == null) {
            return;
        }
        repository.save(supplier);
    }

    public void deleteSupplier(Integer supplierId) {
        repository.deleteById(supplierId);
    }

    public void generateChart() {
        // Get suppliers
        List<Object[]> suppliers = repository.findTop5SuppliersProductCount();

        // Construct the file name
        String fileName = "chart_" + Utils.getDateTimeFileName() + ".pdf";

        // Generate report
        SupplierChartGenerator reportGenerator = new SupplierChartGenerator(suppliers);
        reportGenerator.buildChart(Utils.getReportFolderDirectory("SupplierReports", fileName));
    }

    public void generateTableReport() {
        List<Supplier> suppliers = getAllSuppliers();

        String fileName = "table_" + Utils.getDateTimeFileName() + ".pdf";

        SupplierTableGenerator pdfGenerator = new SupplierTableGenerator(suppliers);
        pdfGenerator.initialize(Utils.getReportFolderDirectory("SupplierReports", fileName));
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Suppliers");
        pdfGenerator.addTable();
        pdfGenerator.build();
    }
}
