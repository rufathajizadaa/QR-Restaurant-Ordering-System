package com.qmenyu.restaurantordering.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "restaurant_tables")  // Renamed to avoid conflict with reserved keyword
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;  // e.g., "Table 1", "Table 2", etc.

    @OneToMany(mappedBy = "table")
    private List<Order> orders;  // A restaurant table can have multiple orders
}
