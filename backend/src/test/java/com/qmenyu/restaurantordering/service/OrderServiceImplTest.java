package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Order;
import com.qmenyu.restaurantordering.model.OrderItem;
import com.qmenyu.restaurantordering.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllOrders() {
        List<Order> mockOrders = List.of(new Order(), new Order());
        when(orderRepository.findAll()).thenReturn(mockOrders);

        List<Order> result = orderService.getAllOrders();

        assertEquals(2, result.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void testGetOrderById() {
        Order mockOrder = new Order();
        mockOrder.setId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(mockOrder));

        Optional<Order> result = orderService.getOrderById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(orderRepository).findById(1L);
    }

    @Test
    void testCreateOrderWithNullId() {
        Order order = new Order();
        order.setItems(List.of(new OrderItem(), new OrderItem()));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order savedOrder = orderService.createOrder(order);

        assertNotNull(savedOrder.getId());
        verify(orderRepository).save(order);
    }

    @Test
    void testUpdateOrderStatusFound() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("pending");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Optional<Order> updated = orderService.updateOrderStatus(1L, "completed");

        assertTrue(updated.isPresent());
        assertEquals("completed", updated.get().getStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void testUpdateOrderStatusNotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Order> result = orderService.updateOrderStatus(999L, "completed");

        assertFalse(result.isPresent());
        verify(orderRepository, never()).save(any());
    }

    @Test
    void testCompleteOrdersByTableIdWithOrders() {
        Order order1 = new Order(); order1.setStatus("pending");
        Order order2 = new Order(); order2.setStatus("in_progress");
        List<Order> orders = List.of(order1, order2);

        when(orderRepository.findByTableIdAndStatusNot(5L, "completed")).thenReturn(orders);

        boolean result = orderService.completeOrdersByTableId(5L);

        assertTrue(result);
        assertEquals("completed", order1.getStatus());
        assertEquals("completed", order2.getStatus());
        verify(orderRepository).saveAll(orders);
    }

    @Test
    void testCompleteOrdersByTableIdWithNoOrders() {
        when(orderRepository.findByTableIdAndStatusNot(10L, "completed")).thenReturn(Collections.emptyList());

        boolean result = orderService.completeOrdersByTableId(10L);

        assertFalse(result);
        verify(orderRepository, never()).saveAll(any());
    }

    @Test
    void testDeleteOrderExists() {
        when(orderRepository.existsById(1L)).thenReturn(true);
        boolean deleted = orderService.deleteOrder(1L);

        assertTrue(deleted);
        verify(orderRepository).deleteById(1L);
    }

    @Test
    void testDeleteOrderNotExists() {
        when(orderRepository.existsById(2L)).thenReturn(false);
        boolean deleted = orderService.deleteOrder(2L);

        assertFalse(deleted);
        verify(orderRepository, never()).deleteById(any());
    }
}
