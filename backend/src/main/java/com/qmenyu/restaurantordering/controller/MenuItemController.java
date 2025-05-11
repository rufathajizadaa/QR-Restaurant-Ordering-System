package com.qmenyu.restaurantordering.controller;

import com.qmenyu.restaurantordering.model.MenuItem;
import com.qmenyu.restaurantordering.service.MenuItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {
    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuItem> getAll() {
        return service.getAllItems();
    }

    @GetMapping("/{id}")
    public MenuItem getById(@PathVariable Long id) {
        return service.getItemById(id);
    }

    @GetMapping("/category/{category}")
    public List<MenuItem> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }

    @PostMapping
    public MenuItem create(@RequestBody MenuItem item) {
        return service.createItem(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteItem(id);
    }
}