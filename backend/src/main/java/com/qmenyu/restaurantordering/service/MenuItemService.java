package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.MenuItem;
import com.qmenyu.restaurantordering.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {
    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }

    public List<MenuItem> getAllItems() {
        return repository.findAll();
    }

    public MenuItem getItemById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<MenuItem> getByCategory(String category) {
        return repository.findByCategory(category);
    }

    public MenuItem createItem(MenuItem item) {
        return repository.save(item);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }
}