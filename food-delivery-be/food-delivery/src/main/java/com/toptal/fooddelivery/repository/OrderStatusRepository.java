package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.Order;
import com.toptal.fooddelivery.model.OrderStatus;
import com.toptal.fooddelivery.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatus,Long> {
    OrderStatus findByStatus(Status status);
    OrderStatus findByOrderAndStatus(Order order, Status status);
}
