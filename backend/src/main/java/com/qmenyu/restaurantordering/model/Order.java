package com.qmenyu.restaurantordering.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_table_id", nullable = false)  // Update column name to reflect new table
    private RestaurantTable table;  // A restaurant table is associated with an order

    @OneToMany
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;  // The order contains multiple items

    private double totalPrice;

    private String status; // e.g., "Pending", "In Progress", "Delivered"

    private String notes; // Optional, for custom instructions

    // Other fields as necessary
}
