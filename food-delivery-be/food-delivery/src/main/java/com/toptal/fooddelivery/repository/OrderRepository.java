package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.Order;
import com.toptal.fooddelivery.response.OrderResponse;
import com.toptal.fooddelivery.response.OrderResponseNoRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<OrderResponseNoRestaurant> findBy();

    List<OrderResponseNoRestaurant> findByUsersId(Long id);
    List<OrderResponseNoRestaurant> findByRestaurantsId(Long id);
}
