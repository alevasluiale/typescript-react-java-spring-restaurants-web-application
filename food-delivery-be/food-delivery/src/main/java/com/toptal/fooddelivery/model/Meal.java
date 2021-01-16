package com.toptal.fooddelivery.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(	name = "meals")
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="meal_id")
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 250)
    private String description;

    @ManyToOne
    @JoinColumn(name="order_id", nullable=false)
    private Order order;

    public Meal() {}

    public Meal(Long id, @NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 250) String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    public Meal(Order order) {
        this.order = order;
    }
    public Meal(Long id, @NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 250) String description,Order order) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.order = order;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
