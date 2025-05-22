package com.qmenyu.restaurantordering.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qmenyu.restaurantordering.model.Order;
import com.qmenyu.restaurantordering.service.OrderService;
import com.qmenyu.restaurantordering.service.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerIntegrationTest {


    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testGetAllOrders() throws Exception {

        Order order1 = new Order(); order1.setId(1L);
        Order order2 = new Order(); order2.setId(2L);

        Mockito.when(orderService.getAllOrders()).thenReturn(Arrays.asList(order1, order2));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testGetOrderById_found() throws Exception {
        Order order = new Order();
        order.setId(1L);

        Mockito.when(orderService.getOrderById(1L)).thenReturn(Optional.of(order));

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void testGetOrderById_notFound() throws Exception {
        Mockito.when(orderService.getOrderById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/orders/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateOrder() throws Exception {
        Order order = new Order();
        order.setId(1L);
        order.setTableId(5);

        Mockito.when(orderService.createOrder(any(Order.class))).thenReturn(order);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void testUpdateOrderStatus() throws Exception {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("COMPLETED");

        Mockito.when(orderService.updateOrderStatus(1L, "COMPLETED"))
                .thenReturn(Optional.of(order));

        mockMvc.perform(patch("/api/orders/1/status?status=COMPLETED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    public void testDeleteOrder_success() throws Exception {
        Mockito.when(orderService.deleteOrder(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testCompleteOrdersByTableId_success() throws Exception {
        Mockito.when(orderService.completeOrdersByTableId(5L)).thenReturn(true);

        mockMvc.perform(patch("/api/orders/table/5/complete"))
                .andExpect(status().isOk());
    }

    @Test
    public void testCompleteOrdersByTableId_notFound() throws Exception {
        Mockito.when(orderService.completeOrdersByTableId(99L)).thenReturn(false);

        mockMvc.perform(patch("/api/orders/table/99/complete"))
                .andExpect(status().isNotFound());
    }
}
