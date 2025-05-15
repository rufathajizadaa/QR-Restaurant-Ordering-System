package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
    Order createOrder(Order order);
    Optional<Order> updateOrderStatus(Long id, String status);
    boolean deleteOrder(Long id);
}