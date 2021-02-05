package com.huhurezmarius.fooddelivery.response;

import com.huhurezmarius.fooddelivery.model.Meal;

import java.util.Set;

public interface RestaurantResponse {
    Long getId();
    String getName();
    String getDescription();
    Set<Meal> getMeals();

}
