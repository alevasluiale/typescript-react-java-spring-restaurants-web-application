package com.toptal.fooddelivery.response;

import com.toptal.fooddelivery.model.Meal;

import java.util.Set;

public interface RestaurantResponse {
    Long getId();
    String getName();
    String getDescription();
    Set<Meal> getMeals();

}
