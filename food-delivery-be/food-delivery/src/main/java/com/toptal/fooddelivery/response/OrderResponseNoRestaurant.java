package com.toptal.fooddelivery.response;

import com.toptal.fooddelivery.model.Meal;
import com.toptal.fooddelivery.model.Restaurant;
import com.toptal.fooddelivery.model.Status;

import java.util.Date;
import java.util.Set;

public interface OrderResponseNoRestaurant {
    Long getId();
    Date getDate();
    double getTotalAmount();
    Set<OrderStatusResponse> getOrderStatuses();
    Set<OrderMealResponse> getOrderMeals();
}
