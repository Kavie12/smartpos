package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.PDFGenerators.LoyaltyCustomerPDFGenerator;
import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import com.robustedge.smartpos_backend.repositories.LoyaltyCustomerRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyCustomerService {

    @Autowired
    private LoyaltyCustomerRepository repository;

    public void addLoyaltyCustomer(LoyaltyCustomer loyaltyCustomer) {
        loyaltyCustomer.setPoints(0);
        repository.save(loyaltyCustomer);
    }

    public List<LoyaltyCustomer> getAllLoyaltyCustomers() {
        return repository.findAll();
    }

    public PagedModel<LoyaltyCustomer> getLoyaltyCustomers(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void deleteLoyaltyCustomer(Integer id) {
        repository.deleteById(id);
    }

    public void updateLoyaltyCustomer(LoyaltyCustomer loyaltyCustomer) {
        if (loyaltyCustomer.getId() != null) {
            repository.save(loyaltyCustomer);
        }
    }

    public void generateReport() {
        List<LoyaltyCustomer> loyaltyCustomers = getAllLoyaltyCustomers();
        String[] fields = {"ID", "First Name", "Last Name", "Phone Number", "Points"};

        String systemUser = System.getProperty("user.name");
        String fileName = Utils.getDateTimeFileName();
        String filePath = "C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf";

        LoyaltyCustomerPDFGenerator pdfGenerator = new LoyaltyCustomerPDFGenerator(loyaltyCustomers);
        pdfGenerator.initialize(filePath);
        pdfGenerator.addMetaData();
        pdfGenerator.addHeading("Loyalty Customers");
        pdfGenerator.addTable(fields);
        pdfGenerator.build();
    }

}
