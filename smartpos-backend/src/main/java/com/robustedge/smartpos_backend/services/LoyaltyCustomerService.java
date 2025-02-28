package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.libraries.PDFTableGenerator;
import com.robustedge.smartpos_backend.models.LoyaltyCustomer;
import com.robustedge.smartpos_backend.repositories.LoyaltyCustomerRepository;
import com.robustedge.smartpos_backend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.Date;
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

        PDFTableGenerator<LoyaltyCustomer> pdfTableGenerator = new PDFTableGenerator<LoyaltyCustomer>();
        pdfTableGenerator
                .initialize("C:\\Users\\" + systemUser + "\\Documents\\SmartPOS\\" + fileName + ".pdf")
                .addMetaData()
                .addHeading("Loyalty Customers")
                .addTable(loyaltyCustomers, fields)
                .build();
    }

}
