package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.libraries.PDFTableGenerator;
import com.robustedge.smartpos_backend.models.Supplier;
import com.robustedge.smartpos_backend.repositories.SupplierRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository repository;

    public void addSupplier(Supplier supplier) {
        repository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public PagedModel<Supplier> getSuppliers(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void deleteSupplier(Integer id) {
        repository.deleteById(id);
    }

    public void updateSupplier(Supplier supplier) {
        if (supplier.getId() != null) {
            repository.save(supplier);
        }
    }

    public void generateReport() {
        List<Supplier> suppliers = getAllSuppliers();
        String[] fields = {"ID", "Name", "Phone Number", "Email"};

        String systemUser = System.getProperty("user.name");
        String fileName = Utils.getDateTimeFileName();

        PDFTableGenerator<Supplier> pdfTableGenerator = new PDFTableGenerator<Supplier>();
        pdfTableGenerator
                .initialize("C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf")
                .addMetaData()
                .addHeading("Suppliers")
                .addTable(suppliers, fields)
                .build();
    }

}
