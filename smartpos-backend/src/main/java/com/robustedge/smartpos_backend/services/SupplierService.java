package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.Supplier;
import com.robustedge.smartpos_backend.repositories.SupplierRepository;
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

    public PagedModel<Supplier> getSuppliers(Pageable pageable) {
        return new PagedModel<>(repository.findAllActiveSupplierPage(pageable));
    }

    public void deleteSupplier(Integer supplierId) {
        repository.deleteById(supplierId);
    }
}
