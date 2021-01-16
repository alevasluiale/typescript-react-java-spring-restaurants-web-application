package com.toptal.fooddelivery.model;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Long id;

    @OneToMany(mappedBy="order")
    private Set<Meal> meals;

    private Date date;

    @Column(name="total_amount")
    private double totalAmount;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "status_id",referencedColumnName = "status_id")
    private Status status;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="restaurant_id",referencedColumnName = "restaurant_id")
    private Restaurant restaurant;

    @OneToMany(mappedBy = "status")
    private Set<OrderStatus> statuses = new HashSet<OrderStatus>();

    public Order() {}

    public Order(Long id, Set<Meal> meals, Date date, double totalAmount, Status status, Restaurant restaurant, Set<OrderStatus> statuses) {
        this.id = id;
        this.meals = meals;
        this.date = date;
        this.totalAmount = totalAmount;
        this.status = status;
        this.restaurant = restaurant;
        this.statuses = statuses;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Set<OrderStatus> getStatuses() {
        return statuses;
    }

    public void setStatuses(Set<OrderStatus> statuses) {
        this.statuses = statuses;
    }
}
