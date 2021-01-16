package com.toptal.fooddelivery.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class OrderStatusPK implements Serializable {

    @Column(name="order_id")
    private Long order_id;

    @Column(name="status_id")
    private Long status_id;
}
