package com.toptal.fooddelivery.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Long id;

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE})
    @JoinTable(
            name="ordered_meals",
            joinColumns = @JoinColumn(name="order_id"),
            inverseJoinColumns = @JoinColumn(name="meal_id")
    )
    private Set<Meal> meals;

    private Date date;

    @Column(name="total_amount")
    private double totalAmount;

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE})
    @JoinTable(name ="order_restaurant",
            joinColumns = {@JoinColumn(name="user_id")},
            inverseJoinColumns = {@JoinColumn(name="restaurant_id")})
    private Set<Restaurant> restaurants = new HashSet<Restaurant>();


    @OneToMany(mappedBy = "order")
    private Set<OrderStatus> orderStatuses = new HashSet<OrderStatus>();

    public Order() {}



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order(Long id, Set<Meal> meals, Date date, double totalAmount, Set<Restaurant> restaurants,Set<OrderStatus> orderStatuses) {
        this.id = id;
        this.meals = meals;
        this.date = date;
        this.totalAmount = totalAmount;
        this.restaurants = restaurants;
        this.orderStatuses = orderStatuses;
    }

    public Set<OrderStatus> getOrderStatuses() {
        return orderStatuses;
    }

    public void setOrderStatuses(Set<OrderStatus> orderStatuses) {
        this.orderStatuses = orderStatuses;
    }

    public Set<Restaurant> getRestaurants() {
        return restaurants;
    }

    public void setRestaurants(Set<Restaurant> restaurants) {
        this.restaurants = restaurants;
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


}
