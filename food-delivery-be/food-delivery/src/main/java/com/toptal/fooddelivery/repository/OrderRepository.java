package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.Order;
import com.toptal.fooddelivery.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
