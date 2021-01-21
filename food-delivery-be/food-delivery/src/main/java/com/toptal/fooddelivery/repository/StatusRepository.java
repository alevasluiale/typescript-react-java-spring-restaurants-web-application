package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.enums.StatusEnum;
import com.toptal.fooddelivery.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status,Long> {
    Status findByName(StatusEnum name);
}
