package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.LoyaltyMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyMemberRepository extends JpaRepository<LoyaltyMember, Integer> {

    @Query("SELECT lm FROM LoyaltyMember lm WHERE lm.deleted = false")
    List<LoyaltyMember> findAllActiveLoyaltyMembers();

    @Query("SELECT lm FROM LoyaltyMember lm WHERE lm.deleted = false AND (:searchKey IS NULL OR CONCAT(lm.firstName, ' ', lm.lastName) LIKE %:searchKey% OR lm.phoneNumber LIKE %:searchKey%)")
    Page<LoyaltyMember> findFilteredLoyaltyMembers(@Param("searchKey") String searchKey, Pageable pageable);

    Optional<LoyaltyMember> findByPhoneNumber(String phoneNumber);

    @Query("SELECT lm FROM LoyaltyMember lm WHERE lm.deleted = false AND lm.points > 0 ORDER BY lm.points DESC LIMIT 5")
    List<LoyaltyMember> findTop5ByPoints();

    @Query("SELECT COUNT(*) FROM LoyaltyMember lm WHERE lm.deleted = false AND lm.phoneNumber = :phoneNumber")
    int NoOfExistingRecords(@Param("phoneNumber") String phoneNumber);
}
