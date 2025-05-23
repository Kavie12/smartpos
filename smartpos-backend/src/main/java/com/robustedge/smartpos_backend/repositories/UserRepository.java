package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    @Query("SELECT COUNT(*) FROM User u WHERE u.username = :username")
    int countByUsername(@Param("username") String username);

}