package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.enums.RoleEnum;
import com.toptal.fooddelivery.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Role findByName(RoleEnum name);
}
