package com.qmenyu.restaurantordering.repository;

import com.qmenyu.restaurantordering.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    // Find all menu items
    List<MenuItem> findAll();

    // Find a menu item by ID
    Optional<MenuItem> findById(Long id);

    // Find menu items by name
    List<MenuItem> findByNameContainingIgnoreCase(String name);

    // Find menu items by ingredient name (join with ingredients table)
    List<MenuItem> findByIngredients_NameIgnoreCase(String ingredientName);

    // Add method to find menu items by category
    List<MenuItem> findByCategoryIgnoreCase(String category);
}
