package com.robustedge.smartpos_backend.services;

import com.robustedge.smartpos_backend.config.ApiRequestException;
import com.robustedge.smartpos_backend.models.LoyaltyMember;
import com.robustedge.smartpos_backend.repositories.LoyaltyCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyMemberService {

    @Autowired
    private LoyaltyCustomerRepository repository;

    public void addLoyaltyMember(LoyaltyMember loyaltyMember) {
        loyaltyMember.setPoints(0);
        try {
            repository.save(loyaltyMember);
        } catch (DataIntegrityViolationException e) {
            throw new ApiRequestException("Loyalty member is already registered.");
        }
    }

    public List<LoyaltyMember> getAllLoyaltyMembers() {
        return repository.findAll();
    }

    public PagedModel<LoyaltyMember> getLoyaltyMembers(Pageable pageable) {
        return new PagedModel<>(repository.findAll(pageable));
    }

    public void deleteLoyaltyMember(Integer id) {
        repository.deleteById(id);
    }
}
