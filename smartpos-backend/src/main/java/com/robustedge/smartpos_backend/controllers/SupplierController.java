package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.models.Supplier;
import com.robustedge.smartpos_backend.services.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService service;

    @GetMapping("/get_all")
    public List<Supplier> getAllSuppliers() {
        return service.getAllSuppliers();
    }

    @GetMapping("/get")
    public PagedModel<Supplier> getSuppliers(@PageableDefault(value = 50, page = 0) Pageable pageable) {
        return service.getSuppliers(pageable);
    }

    @GetMapping("/get_one")
    public Supplier getOne(@RequestParam(name = "supplierId") Integer supplierId) {
        return service.getOne(supplierId);
    }

    @PostMapping("/add")
    public void addSupplier(@RequestBody Supplier supplier) {
        service.addSupplier(supplier);
    }

    @PutMapping("/update")
    public void updateSupplier(@RequestBody Supplier supplier) {
        service.updateSupplier(supplier);
    }

    @DeleteMapping("/delete")
    public void deleteSupplier(@RequestParam(name = "supplierId") Integer supplierId) {
        service.deleteSupplier(supplierId);
    }

}
