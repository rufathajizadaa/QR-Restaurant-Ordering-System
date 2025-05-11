package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Order;
import com.qmenyu.restaurantordering.model.RestaurantTable;
import com.qmenyu.restaurantordering.repository.OrderRepository;
import com.qmenyu.restaurantordering.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantTableRepository restaurantTableRepository;

    public OrderService(OrderRepository orderRepository, RestaurantTableRepository restaurantTableRepository) {
        this.orderRepository = orderRepository;
        this.restaurantTableRepository = restaurantTableRepository;
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by ID
    public Order getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Create a new order
    public Order createOrder(Order order) {
        // Ensure the table exists by retrieving it from the database
        RestaurantTable table = restaurantTableRepository.findById(order.getTable().getId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        order.setTable(table);  // Set the table for the order
        return orderRepository.save(order);  // Save the order to the database
    }

    // Update the order status
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);  // Retrieve the order by ID
        order.setStatus(status);  // Update the status
        return orderRepository.save(order);  // Save the updated order
    }
}
