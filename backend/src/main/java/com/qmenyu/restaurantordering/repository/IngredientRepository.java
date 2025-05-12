package com.qmenyu.restaurantordering.repository;

import com.qmenyu.restaurantordering.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    // Find all ingredients
    List<Ingredient> findAll();

    // Find an ingredient by ID
    Optional<Ingredient> findById(Long id);

    // Find ingredient by name
    Optional<Ingredient> findByNameIgnoreCase(String name);

    // Find ingredients by menu items
    List<Ingredient> findByMenuItems_Id(Long menuItemId);
}
