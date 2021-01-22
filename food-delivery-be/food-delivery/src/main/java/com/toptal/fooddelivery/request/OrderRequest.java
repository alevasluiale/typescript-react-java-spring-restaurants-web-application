package com.toptal.fooddelivery.request;

import com.toptal.fooddelivery.model.Meal;
import com.toptal.fooddelivery.model.Restaurant;

import java.util.Date;
import java.util.List;

public class OrderRequest {

    private List<MealRequest> meals;
    private Date date;
    private Restaurant restaurant;
    private double amount;
    public OrderRequest() {
    }

    public OrderRequest(List<MealRequest> meals, Date date, double totalAmount, Restaurant restaurant) {
        this.meals = meals;
        this.date = date;
        this.restaurant = restaurant;
    }

    public OrderRequest(List<MealRequest> meals, Date date, Restaurant restaurant, double amount) {
        this.meals = meals;
        this.date = date;
        this.restaurant = restaurant;
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public List<MealRequest> getMeals() {
        return meals;
    }

    public void setMeals(List<MealRequest> meals) {
        this.meals = meals;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }
}
