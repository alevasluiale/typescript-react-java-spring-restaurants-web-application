package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.enums.TypeEnum;
import com.huhurezmarius.fooddelivery.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeRepository extends JpaRepository<Type,Long> {
    Type findByName(TypeEnum name);
}
