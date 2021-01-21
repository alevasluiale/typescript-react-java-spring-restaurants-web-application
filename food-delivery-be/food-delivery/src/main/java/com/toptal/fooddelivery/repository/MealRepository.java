package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    Optional<Meal> findByName(String name);

    Boolean existsByName(String name);
}
