package com.qmenyu.restaurantordering.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String category;  // e.g., Appetizer, Main Course, Drink

    private double price;

    private String imageUrl; // optional, in case you want to show images
}