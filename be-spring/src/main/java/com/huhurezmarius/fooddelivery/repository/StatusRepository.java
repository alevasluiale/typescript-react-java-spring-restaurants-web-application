package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.enums.StatusEnum;
import com.huhurezmarius.fooddelivery.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status,Long> {
    Status findByName(StatusEnum name);
}
