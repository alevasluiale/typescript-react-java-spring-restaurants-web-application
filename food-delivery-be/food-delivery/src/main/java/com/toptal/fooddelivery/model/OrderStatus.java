package com.toptal.fooddelivery.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="orders_statuses")
public class OrderStatus {

    @EmbeddedId
    private OrderStatusPK id;

    @ManyToOne
    @MapsId("order_id")
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @MapsId("status_id")
    @JoinColumn(name = "status_id")
    private Status status;

    private Date date;

    public OrderStatus() {}

    public OrderStatus(OrderStatusPK id, Order order, Status status, Date date) {
        this.id = id;
        this.order = order;
        this.status = status;
        this.date = date;
    }

    public OrderStatusPK getId() {
        return id;
    }

    public void setId(OrderStatusPK id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
