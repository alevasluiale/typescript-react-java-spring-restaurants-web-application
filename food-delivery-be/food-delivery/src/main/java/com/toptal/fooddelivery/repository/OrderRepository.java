package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.Order;
import com.toptal.fooddelivery.model.Restaurant;
import com.toptal.fooddelivery.response.OrderResponse;
import com.toptal.fooddelivery.response.OrderResponseNoRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<OrderResponse> findBy();

    List<OrderResponse> findByUsersId(Long id);
    List<OrderResponseNoRestaurant> findByRestaurantsId(Long id);
}
