package com.qmenyu.restaurantordering.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ingredient")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @ManyToMany(mappedBy = "ingredients")
    @JsonIgnore
    private Set<MenuItem> menuItems = new HashSet<>();


    // Constructors
    public Ingredient() {}

    public Ingredient(String name) {
        this.name = name;
    }


    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Set<MenuItem> getMenuItems() { return menuItems; }

    public void setMenuItems(Set<MenuItem> menuItems) { this.menuItems = menuItems; }

}
