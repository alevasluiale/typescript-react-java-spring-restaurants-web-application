package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.model.Order;
import com.huhurezmarius.fooddelivery.response.OrderResponse;
import com.huhurezmarius.fooddelivery.response.OrderResponseNoRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<OrderResponseNoRestaurant> findBy();

    List<OrderResponseNoRestaurant> findByUsersId(Long id);
    List<OrderResponseNoRestaurant> findByRestaurantsId(Long id);

}
