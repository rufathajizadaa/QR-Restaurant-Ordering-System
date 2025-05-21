package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Order;
import com.qmenyu.restaurantordering.model.OrderItem;
import com.qmenyu.restaurantordering.repository.OrderRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    public void testGetAllOrders() {
        List<Order> orders = new ArrayList<>();
        orders.add(new Order());
        when(orderRepository.findAll()).thenReturn(orders);

        List<Order> result = orderService.getAllOrders();
        assertEquals(1, result.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    public void testGetOrderByIdFound() {
        Order order = new Order();
        order.setId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Optional<Order> result = orderService.getOrderById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    public void testGetOrderByIdNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Order> result = orderService.getOrderById(1L);
        assertFalse(result.isPresent());
    }

    @Test
    public void testCreateOrderWithIdSet() {
        Order order = new Order();
        order.setId(123L);

        // Add some order items (mock order item setter)
        OrderItem item = new OrderItem();
        List<OrderItem> items = new ArrayList<>();
        items.add(item);
        order.setItems(items);

        when(orderRepository.save(order)).thenReturn(order);

        Order result = orderService.createOrder(order);
        assertEquals(123L, result.getId());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    public void testCreateOrderWithNullIdSetsId() {
        Order order = new Order();

        OrderItem item = new OrderItem();
        List<OrderItem> items = new ArrayList<>();
        items.add(item);
        order.setItems(items);

        when(orderRepository.save(order)).thenReturn(order);

        Order result = orderService.createOrder(order);
        assertNotNull(result.getId());
        verify(orderRepository, times(1)).save(order);
        assertEquals(order, item.getOrder()); // Item’s order should be set
    }

    @Test
    public void testUpdateOrderStatusFound() {
        Order order = new Order();
        order.setStatus("Pending");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        Optional<Order> updated = orderService.updateOrderStatus(1L, "Completed");
        assertTrue(updated.isPresent());
        assertEquals("Completed", updated.get().getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    public void testUpdateOrderStatusNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Order> updated = orderService.updateOrderStatus(1L, "Completed");
        assertFalse(updated.isPresent());
        verify(orderRepository, never()).save(any());
    }

    @Test
    public void testDeleteOrderExists() {
        System.out.println("Burdayam");
        when(orderRepository.existsById(1L)).thenReturn(true);
        doNothing().when(orderRepository).deleteById(1L);

        boolean deleted = orderService.deleteOrder(1L);
        assertTrue(deleted);
        verify(orderRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteOrderNotExists() {
        when(orderRepository.existsById(1L)).thenReturn(false);

        boolean deleted = orderService.deleteOrder(1L);
        assertFalse(deleted);
        verify(orderRepository, never()).deleteById(anyLong());
    }
}
