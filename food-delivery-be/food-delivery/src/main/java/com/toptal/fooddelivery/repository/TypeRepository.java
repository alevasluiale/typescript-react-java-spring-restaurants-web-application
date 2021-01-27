package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.enums.TypeEnum;
import com.toptal.fooddelivery.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeRepository extends JpaRepository<Type,Long> {
    Type findByName(TypeEnum name);
}
