package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Order;
import com.qmenyu.restaurantordering.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order createOrder(Order order) {
        // Ensure the order has a unique ID. You can generate it using a timestamp or another unique generator.
        // Here, we're using the current time in milliseconds as a unique ID (you can modify this logic as needed).
        if (order.getId() == null) {
            order.setId(System.currentTimeMillis()); // or another method of generating unique IDs
        }

        // Set the order items and associate them with the order
        order.getItems().forEach(item -> item.setOrder(order));

        // Save the order to the database
        return orderRepository.save(order);
    }

    @Override
    public Optional<Order> updateOrderStatus(Long id, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        optionalOrder.ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
        });
        return optionalOrder;
    }

    @Override
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
