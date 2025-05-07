package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.dto.LoyaltyMemberRequest;
import com.robustedge.smartpos_backend.services.LoyaltyMemberService;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/loyalty_members")
public class LoyaltyMemberController {

    @Autowired
    private LoyaltyMemberService service;

    @GetMapping("/get_all")
    public List<LoyaltyMember> getAllLoyaltyMembers() {
        return service.getAllLoyaltyMembers();
    }

    @GetMapping("/get")
    public PagedModel<LoyaltyMember> getLoyaltyMembers(
            @RequestParam(name = "searchKey") String searchKey,
            @PageableDefault(value = 50, page = 0) Pageable pageable
    ) {
        return service.getLoyaltyMembers(searchKey, pageable);
    }

    @GetMapping("/get_one")
    public LoyaltyMember getOne(@RequestParam(name = "id") Integer id) {
        return service.getOne(id);
    }

    @GetMapping("/get_one_by_phone_number")
    public LoyaltyMember getOneByPhoneNumber(@RequestParam(name = "phoneNumber") String phoneNumber) {
        return service.getOneByPhoneNumber(phoneNumber);
    }

    @PostMapping("/add")
    public void addLoyaltyMember(@RequestBody LoyaltyMemberRequest loyaltyMemberRequest) {
        service.addLoyaltyMember(loyaltyMemberRequest);
    }

    @PutMapping("/update")
    public void updateLoyaltyMember(@RequestBody LoyaltyMember loyaltyMember) {
        service.updateLoyaltyMember(loyaltyMember);
    }

    @DeleteMapping("/delete")
    public void deleteLoyaltyMember(@RequestParam(name = "id") Integer id) {
        service.deleteLoyaltyMember(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/generate_chart")
    public void generateChart() {
        service.generateChart();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/generate_table_report")
    public void generateTableReport() {
        service.generateTableReport();
    }

    @GetMapping("/generate_card")
    public void generateCard(@RequestParam(name = "id") Integer id) {
        service.generateCard(id);
    }

}
