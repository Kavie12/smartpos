package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Employee;
import com.robustedge.smartpos_backend.models.Supplier;
import com.robustedge.smartpos_backend.report_generators.EmployeeReportGenerator;
import com.robustedge.smartpos_backend.report_generators.SupplierReportGenerator;
import com.robustedge.smartpos_backend.repositories.SupplierRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository repository;

    public void addSupplier(Supplier supplier) {
        try {
            repository.save(supplier);
        } catch (DataIntegrityViolationException e) {
            throw new ApiRequestException("The phone number or email belongs to a registered supplier.");
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
        if (supplier.getId() != null) {
            repository.save(supplier);
        }
    }

    public void deleteSupplier(Integer supplierId) {
        repository.deleteById(supplierId);
    }

    public void generateReport() {
        List<Object[]> suppliers = repository.findTop5SuppliersProductCount();

        String systemUser = System.getProperty("user.name");
        String fileName = "report_" + Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\SupplierReports\\" + fileName + ".pdf";

        SupplierReportGenerator reportGenerator = new SupplierReportGenerator(suppliers);
        reportGenerator.buildChart(filePath);
    }
}
