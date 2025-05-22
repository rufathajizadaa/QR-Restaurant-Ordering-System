package com.qmenyu.restaurantordering.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qmenyu.restaurantordering.model.Ingredient;
import com.qmenyu.restaurantordering.model.MenuItem;
import com.qmenyu.restaurantordering.repository.IngredientRepository;
import com.qmenyu.restaurantordering.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class MenuItemControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MenuItem testMenuItem;
    private Ingredient testIngredient;

    @BeforeEach
    public void setup() {
        // Clear repositories before each test
        menuItemRepository.deleteAll();
        ingredientRepository.deleteAll();

        // Create test ingredient
        testIngredient = new Ingredient();
        testIngredient.setName("Tomato");
        ingredientRepository.save(testIngredient);

        // Create test menu item
        testMenuItem = new MenuItem();
        testMenuItem.setName("Tomato Soup");
        testMenuItem.setDescription("Delicious tomato soup");
        testMenuItem.setPrice(BigDecimal.valueOf(5.99));
        testMenuItem.setCategory("Soup");
        testMenuItem.setIngredients(Collections.singleton(testIngredient));
        menuItemRepository.save(testMenuItem);
    }

    @Test
    public void testGetAllMenuItems() throws Exception {
        mockMvc.perform(get("/api/menu-items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Tomato Soup"));
    }

    @Test
    public void testGetMenuItemById() throws Exception {
        mockMvc.perform(get("/api/menu-items/{id}", testMenuItem.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Tomato Soup"));
    }

    @Test
    public void testCreateMenuItem() throws Exception {
        MenuItem newMenuItem = new MenuItem();
        newMenuItem.setName("Grilled Cheese");
        newMenuItem.setDescription("Toasty grilled cheese sandwich");
        newMenuItem.setPrice(BigDecimal.valueOf(3.99));
        newMenuItem.setCategory("Sandwich");
        newMenuItem.setIngredients(Collections.emptySet());

        mockMvc.perform(post("/api/menu-items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMenuItem)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Grilled Cheese"));
    }

    @Test
    public void testUpdateMenuItem() throws Exception {
        testMenuItem.setPrice(BigDecimal.valueOf(6.99)); // change price

        mockMvc.perform(put("/api/menu-items/{id}", testMenuItem.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testMenuItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(6.99));
    }

    @Test
    public void testDeleteMenuItem() throws Exception {
        mockMvc.perform(delete("/api/menu-items/{id}", testMenuItem.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testAddIngredientToMenuItem() throws Exception {
        Ingredient newIngredient = new Ingredient();
        newIngredient.setName("Basil");
        ingredientRepository.save(newIngredient);

        mockMvc.perform(post("/api/menu-items/{menuItemId}/ingredients/{ingredientId}",
                        testMenuItem.getId(), newIngredient.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ingredients[?(@.name == 'Basil')]").exists());
    }

    @Test
    public void testRemoveIngredientFromMenuItem() throws Exception {
        mockMvc.perform(delete("/api/menu-items/{menuItemId}/ingredients/{ingredientId}",
                        testMenuItem.getId(), testIngredient.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ingredients[?(@.name == 'Tomato')]").doesNotExist());
    }
}
