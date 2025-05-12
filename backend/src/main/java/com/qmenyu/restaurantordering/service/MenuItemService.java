package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Ingredient;
import com.qmenyu.restaurantordering.model.MenuItem;
import com.qmenyu.restaurantordering.repository.MenuItemRepository;
import com.qmenyu.restaurantordering.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final IngredientRepository ingredientRepository;

    @Autowired
    public MenuItemService(MenuItemRepository menuItemRepository, IngredientRepository ingredientRepository) {
        this.menuItemRepository = menuItemRepository;
        this.ingredientRepository = ingredientRepository;
    }

    // Get all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get a menu item by ID
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    // Search for menu items by name
    public List<MenuItem> searchMenuItemsByName(String name) {
        return menuItemRepository.findByNameContainingIgnoreCase(name);
    }

    // Get menu items by ingredient name
    public List<MenuItem> getMenuItemsByIngredient(String ingredientName) {
        return menuItemRepository.findByIngredients_NameIgnoreCase(ingredientName);
    }

    // Get menu items by category
    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategoryIgnoreCase(category);
    }

    // Create a new menu item
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    // Update an existing menu item
    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id " + id));

        menuItem.setName(menuItemDetails.getName());
        menuItem.setDescription(menuItemDetails.getDescription());
        menuItem.setPrice(menuItemDetails.getPrice());
        menuItem.setImageUrl(menuItemDetails.getImageUrl());
        menuItem.setIngredients(menuItemDetails.getIngredients());
        menuItem.setCategory(menuItemDetails.getCategory()); // Added category field update

        return menuItemRepository.save(menuItem);
    }

    // Delete a menu item by ID
    public void deleteMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id " + id));
        menuItemRepository.delete(menuItem);
    }

    // Add an ingredient to a menu item
    public MenuItem addIngredientToMenuItem(Long menuItemId, Long ingredientId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id " + menuItemId));

        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found with id " + ingredientId));

        menuItem.addIngredient(ingredient);
        return menuItemRepository.save(menuItem);
    }

    // Remove an ingredient from a menu item
    public MenuItem removeIngredientFromMenuItem(Long menuItemId, Long ingredientId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id " + menuItemId));

        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found with id " + ingredientId));

        menuItem.removeIngredient(ingredient);
        return menuItemRepository.save(menuItem);
    }
}
