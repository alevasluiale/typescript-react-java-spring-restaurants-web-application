package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.OrderMeal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderMealRepository extends JpaRepository<OrderMeal,Long> {
}
