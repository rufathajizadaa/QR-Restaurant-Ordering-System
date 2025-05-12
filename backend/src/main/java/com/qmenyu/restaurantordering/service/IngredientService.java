package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Ingredient;
import com.qmenyu.restaurantordering.repository.IngredientRepository;
import com.qmenyu.restaurantordering.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final MenuItemRepository menuItemRepository;

    @Autowired
    public IngredientService(IngredientRepository ingredientRepository, MenuItemRepository menuItemRepository) {
        this.ingredientRepository = ingredientRepository;
        this.menuItemRepository = menuItemRepository;
    }

    // Get all ingredients
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // Get an ingredient by ID
    public Optional<Ingredient> getIngredientById(Long id) {
        return ingredientRepository.findById(id);
    }

    // Get an ingredient by name
    public Optional<Ingredient> getIngredientByName(String name) {
        return ingredientRepository.findByNameIgnoreCase(name);
    }

    // Get ingredients by menu item ID
    public List<Ingredient> getIngredientsByMenuItem(Long menuItemId) {
        return ingredientRepository.findByMenuItems_Id(menuItemId);
    }

    // Create a new ingredient
    public Ingredient createIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    // Update an existing ingredient
    public Ingredient updateIngredient(Long id, Ingredient ingredientDetails) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found with id " + id));

        ingredient.setName(ingredientDetails.getName());
        return ingredientRepository.save(ingredient);
    }

    // Delete an ingredient by ID
    public void deleteIngredient(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found with id " + id));
        ingredientRepository.delete(ingredient);
    }
}
