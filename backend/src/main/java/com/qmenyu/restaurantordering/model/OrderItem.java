package com.qmenyu.restaurantordering.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;  // Link to MenuItem

    private int quantity;

    private double price;  // Store the price at the time of order (in case prices change)

    // Other fields like special instructions can be added if needed
}
    