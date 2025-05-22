//package com.qmenyu.restaurantordering.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.qmenyu.restaurantordering.model.Order;
//import com.qmenyu.restaurantordering.service.OrderService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(OrderController.class)
//class OrderControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private OrderService orderService;  // mock the service layer
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void testGetAllOrders() throws Exception {
//        Order order1 = new Order();
//        order1.setId(1L);
//        Order order2 = new Order();
//        order2.setId(2L);
//
//        when(orderService.getAllOrders()).thenReturn(List.of(order1, order2));
//
//        mockMvc.perform(get("/api/orders"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(2))
//                .andExpect(jsonPath("$[0].id").value(1L))
//                .andExpect(jsonPath("$[1].id").value(2L));
//
//        verify(orderService).getAllOrders();
//    }
//
//    @Test
//    void testGetOrderByIdFound() throws Exception {
//        Order order = new Order();
//        order.setId(1L);
//
//        when(orderService.getOrderById(1L)).thenReturn(Optional.of(order));
//
//        mockMvc.perform(get("/api/orders/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L));
//
//        verify(orderService).getOrderById(1L);
//    }
//
//    @Test
//    void testGetOrderByIdNotFound() throws Exception {
//        when(orderService.getOrderById(999L)).thenReturn(Optional.empty());
//
//        mockMvc.perform(get("/api/orders/999"))
//                .andExpect(status().isNotFound());
//
//        verify(orderService).getOrderById(999L);
//    }
//
//    @Test
//    void testCreateOrder() throws Exception {
//        Order order = new Order();
//        order.setId(null);
//
//        Order savedOrder = new Order();
//        savedOrder.setId(1L);
//
//        when(orderService.createOrder(any(Order.class))).thenReturn(savedOrder);
//
//        mockMvc.perform(post("/api/orders")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(order)))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").value(1L));
//
//        verify(orderService).createOrder(any(Order.class));
//    }
//
//    @Test
//    void testUpdateOrderStatusFound() throws Exception {
//        Order updatedOrder = new Order();
//        updatedOrder.setId(1L);
//        updatedOrder.setStatus("completed");
//
//        when(orderService.updateOrderStatus(1L, "completed")).thenReturn(Optional.of(updatedOrder));
//
//        mockMvc.perform(patch("/api/orders/1/status")
//                        .param("status", "completed"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value("completed"));
//
//        verify(orderService).updateOrderStatus(1L, "completed");
//    }
//
//    @Test
//    void testUpdateOrderStatusNotFound() throws Exception {
//        when(orderService.updateOrderStatus(999L, "completed")).thenReturn(Optional.empty());
//
//        mockMvc.perform(patch("/api/orders/999/status")
//                        .param("status", "completed"))
//                .andExpect(status().isNotFound());
//
//        verify(orderService).updateOrderStatus(999L, "completed");
//    }
//
//    @Test
//    void testCompleteOrdersByTableIdFound() throws Exception {
//        when(orderService.completeOrdersByTableId(5L)).thenReturn(true);
//
//        mockMvc.perform(patch("/api/orders/table/5/complete"))
//                .andExpect(status().isOk());
//
//        verify(orderService).completeOrdersByTableId(5L);
//    }
//
//    @Test
//    void testCompleteOrdersByTableIdNotFound() throws Exception {
//        when(orderService.completeOrdersByTableId(10L)).thenReturn(false);
//
//        mockMvc.perform(patch("/api/orders/table/10/complete"))
//                .andExpect(status().isNotFound());
//
//        verify(orderService).completeOrdersByTableId(10L);
//    }
//
//    @Test
//    void testDeleteOrderExists() throws Exception {
//        when(orderService.deleteOrder(1L)).thenReturn(true);
//
//        mockMvc.perform(delete("/api/orders/1"))
//                .andExpect(status().isNoContent());
//
//        verify(orderService).deleteOrder(1L);
//    }
//
//    @Test
//    void testDeleteOrderNotExists() throws Exception {
//        when(orderService.deleteOrder(2L)).thenReturn(false);
//
//        mockMvc.perform(delete("/api/orders/2"))
//                .andExpect(status().isNotFound());
//
//        verify(orderService).deleteOrder(2L);
//    }
//}
