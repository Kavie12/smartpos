package com.robustedge.smartpos_backend.repositories;

import com.robustedge.smartpos_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUsername(String username);

}
