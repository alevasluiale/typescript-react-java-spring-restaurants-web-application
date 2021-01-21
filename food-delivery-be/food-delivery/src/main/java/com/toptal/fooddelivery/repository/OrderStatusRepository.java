package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatus,Long> {
}
