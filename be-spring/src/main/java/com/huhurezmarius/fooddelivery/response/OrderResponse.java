package com.huhurezmarius.fooddelivery.response;

import com.huhurezmarius.fooddelivery.model.Meal;
import com.huhurezmarius.fooddelivery.model.Restaurant;
import com.huhurezmarius.fooddelivery.model.Status;

import java.util.Date;
import java.util.Set;

interface OrderStatusResponse {
    Status getStatus();
    Date getDate();
}
interface OrderMealResponse {
    Meal getMeal();
    int getQuantity();
}
public interface OrderResponse {
    Long getId();
    Date getDate();
    double getTotalAmount();
    Set<Restaurant> getRestaurants();
    Set<OrderStatusResponse> getOrderStatuses();
    Set<OrderMealResponse> getOrderMeals();
}
