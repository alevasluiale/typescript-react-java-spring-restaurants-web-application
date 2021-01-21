package com.toptal.fooddelivery.request;

import com.toptal.fooddelivery.model.Meal;
import com.toptal.fooddelivery.model.Restaurant;

import java.util.Date;
import java.util.List;
import java.util.Set;

public class OrderRequest {

    private Set<Meal> meals;
    private Date date;
    private double totalAmount;
    private Restaurant restaurant;

    public OrderRequest() {
    }

    public OrderRequest(Set<Meal> meals, Date date, double totalAmount, Restaurant restaurant) {
        this.meals = meals;
        this.date = date;
        this.totalAmount = totalAmount;
        this.restaurant = restaurant;
    }

    public Set<Meal> getMeals() {
        return meals;
    }

    public void setMeals(Set<Meal> meals) {
        this.meals = meals;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }
}
