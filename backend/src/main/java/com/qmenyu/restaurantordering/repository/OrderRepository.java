package com.qmenyu.restaurantordering.repository;

import com.qmenyu.restaurantordering.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(String status);  // Custom query method for status
}
