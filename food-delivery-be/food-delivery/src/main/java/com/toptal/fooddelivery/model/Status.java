package com.toptal.fooddelivery.model;

import com.toptal.fooddelivery.enums.StatusEnum;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

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

    @OneToOne(mappedBy = "status")
    private Order order;

    @OneToMany(mappedBy = "order")
    private Set<OrderStatus> orders = new HashSet<OrderStatus>();

    public Status() {}

    public Status(Long id, StatusEnum name, Order order, Set<OrderStatus> orders) {
        this.id = id;
        this.name = name;
        this.order = order;
        this.orders = orders;
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

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Set<OrderStatus> getOrders() {
        return orders;
    }

    public void setOrders(Set<OrderStatus> orders) {
        this.orders = orders;
    }
}
