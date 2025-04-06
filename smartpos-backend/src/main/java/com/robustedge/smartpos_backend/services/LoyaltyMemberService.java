package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import com.robustedge.smartpos_backend.repositories.LoyaltyMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyMemberService {

    @Autowired
    private LoyaltyMemberRepository repository;

    public void addLoyaltyMember(LoyaltyMember loyaltyMember) {
        loyaltyMember.setPoints((double) 0);
        try {
            repository.save(loyaltyMember);
        } catch (DataIntegrityViolationException e) {
            throw new ApiRequestException("The phone number belongs to a registered supplier.");
        }
    }

    public List<LoyaltyMember> getAllLoyaltyMembers() {
        return repository.findAll();
    }

    public PagedModel<LoyaltyMember> getLoyaltyMembers(String searchKey, Pageable pageable) {
        return new PagedModel<>(repository.findFilteredLoyaltyMembers(searchKey, pageable));
    }

    public void updateLoyaltyMember(LoyaltyMember loyaltyMember) {
        if (loyaltyMember != null) {
            repository.save(loyaltyMember);
        }
    }

    public void deleteLoyaltyMember(Integer id) {
        repository.deleteById(id);
    }

    public LoyaltyMember getOne(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ApiRequestException("Loyalty member not found."));
    }

    public LoyaltyMember getOneByPhoneNumber(String phoneNumber) {
        return repository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new ApiRequestException("Loyalty member not found."));
    }
}
