package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.model.OrderMeal;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

public interface OrderMealRepository extends JpaRepository<OrderMeal,Long> {
    @Transactional
    void deleteByMealId(Long id);
}
