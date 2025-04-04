package com.robustedge.smartpos_backend.controllers;

import com.robustedge.smartpos_backend.services.LoyaltyMemberService;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
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
    public PagedModel<LoyaltyMember> getLoyaltyMembers(@PageableDefault(value = 50, page = 0) Pageable pageable) {
        return service.getLoyaltyMembers(pageable);
    }

    @GetMapping("/get_one")
    public LoyaltyMember getOne(@RequestParam(name = "id") Integer id) {
        return service.getOne(id);
    }

    @PostMapping("/add")
    public void addLoyaltyMember(@RequestBody LoyaltyMember loyaltyMember) {
        service.addLoyaltyMember(loyaltyMember);
    }

    @PutMapping("/update")
    public void updateLoyaltyMember(@RequestBody LoyaltyMember loyaltyMember) {
        service.updateLoyaltyMember(loyaltyMember);
    }

    @DeleteMapping("/delete")
    public void deleteLoyaltyMember(@RequestParam(name = "id") Integer id) {
        service.deleteLoyaltyMember(id);
    }

}
