package com.toptal.fooddelivery.model;

import com.toptal.fooddelivery.enums.StatusEnum;

import javax.persistence.*;

@Entity
@Table(name = "statuses")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="status_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatusEnum name;


    public Status() {}

    public Status(Long id, StatusEnum name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StatusEnum getName() {
        return name;
    }

    public void setName(StatusEnum name) {
        this.name = name;
    }

//    public Order getOrder() {
//        return order;
//    }
//
//    public void setOrder(Order order) {
//        this.order = order;
//    }
//
//    public Set<OrderStatus> getOrders() {
//        return orders;
//    }
//
//    public void setOrders(Set<OrderStatus> orders) {
//        this.orders = orders;
//    }
}
