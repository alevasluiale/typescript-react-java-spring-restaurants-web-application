package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.enums.RoleEnum;
import com.huhurezmarius.fooddelivery.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Role findByName(RoleEnum name);
}
