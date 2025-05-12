package com.qmenyu.restaurantordering.controller;

import com.qmenyu.restaurantordering.model.MenuItem;
import com.qmenyu.restaurantordering.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @Autowired
    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    // Get all menu items
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }

    // Get menu item by ID
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> menuItem = menuItemService.getMenuItemById(id);
        return menuItem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Search menu items by name
    @GetMapping("/search")
    public List<MenuItem> searchMenuItemsByName(@RequestParam String name) {
        return menuItemService.searchMenuItemsByName(name);
    }

    // Get menu items by ingredient
    @GetMapping("/ingredients")
    public List<MenuItem> getMenuItemsByIngredient(@RequestParam String ingredientName) {
        return menuItemService.getMenuItemsByIngredient(ingredientName);
    }

    // Get menu items by category
    @GetMapping("/category")
    public List<MenuItem> getMenuItemsByCategory(@RequestParam String category) {
        return menuItemService.getMenuItemsByCategory(category);
    }

    // Create a new menu item
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem createdMenuItem = menuItemService.createMenuItem(menuItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMenuItem);
    }

    // Update an existing menu item
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItemDetails) {
        MenuItem updatedMenuItem = menuItemService.updateMenuItem(id, menuItemDetails);
        return ResponseEntity.ok(updatedMenuItem);
    }

    // Delete a menu item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    // Add an ingredient to a menu item
    @PostMapping("/{menuItemId}/ingredients/{ingredientId}")
    public ResponseEntity<MenuItem> addIngredientToMenuItem(@PathVariable Long menuItemId, @PathVariable Long ingredientId) {
        MenuItem updatedMenuItem = menuItemService.addIngredientToMenuItem(menuItemId, ingredientId);
        return ResponseEntity.ok(updatedMenuItem);
    }

    // Remove an ingredient from a menu item
    @DeleteMapping("/{menuItemId}/ingredients/{ingredientId}")
    public ResponseEntity<MenuItem> removeIngredientFromMenuItem(@PathVariable Long menuItemId, @PathVariable Long ingredientId) {
        MenuItem updatedMenuItem = menuItemService.removeIngredientFromMenuItem(menuItemId, ingredientId);
        return ResponseEntity.ok(updatedMenuItem);
    }
}
