package com.qmenyu.restaurantordering.repository;

import com.qmenyu.restaurantordering.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
