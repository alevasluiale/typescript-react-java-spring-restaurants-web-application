package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.model.Order;
import com.huhurezmarius.fooddelivery.model.OrderStatus;
import com.huhurezmarius.fooddelivery.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatus,Long> {
    OrderStatus findByStatus(Status status);
    OrderStatus findByOrderAndStatus(Order order, Status status);
}
