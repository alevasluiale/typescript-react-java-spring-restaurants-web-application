package com.toptal.fooddelivery.response;

import com.toptal.fooddelivery.model.Meal;
import com.toptal.fooddelivery.model.Restaurant;
import com.toptal.fooddelivery.model.Status;

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
