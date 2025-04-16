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

    @Query("select lm from LoyaltyMember lm where :searchKey is null or lm.firstName like %:searchKey% or lm.lastName like %:searchKey%")
    Page<LoyaltyMember> findFilteredLoyaltyMembers(@Param("searchKey") String searchKey, Pageable pageable);

    Optional<LoyaltyMember> findByPhoneNumber(String phoneNumber);

    @Query("select lm from LoyaltyMember lm where lm.points > 0 order by lm.points desc limit 5")
    List<LoyaltyMember> findTop5ByPoints();
}
