package com.huhurezmarius.fooddelivery.response;

import com.huhurezmarius.fooddelivery.model.Meal;
import com.huhurezmarius.fooddelivery.model.Restaurant;
import com.huhurezmarius.fooddelivery.model.Status;

import java.util.Date;
import java.util.Set;
interface Rest {
    String getName();
}
public interface OrderResponseNoRestaurant {
    Long getId();
    Date getDate();
    double getTotalAmount();
    Set<OrderStatusResponse> getOrderStatuses();
    Set<OrderMealResponse> getOrderMeals();
    Set<Rest> getRestaurants();
}
