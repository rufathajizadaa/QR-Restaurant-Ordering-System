package com.qmenyu.restaurantordering.service;

import com.qmenyu.restaurantordering.model.Ingredient;
import com.qmenyu.restaurantordering.model.MenuItem;
import com.qmenyu.restaurantordering.repository.IngredientRepository;
import com.qmenyu.restaurantordering.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MenuItemServiceTest {

    private MenuItemRepository menuItemRepository;
    private IngredientRepository ingredientRepository;
    private MenuItemService menuItemService;

    @BeforeEach
    void setUp() {
        menuItemRepository = mock(MenuItemRepository.class);
        ingredientRepository = mock(IngredientRepository.class);
        menuItemService = new MenuItemService(menuItemRepository, ingredientRepository);
    }

    @Test
    void testGetAllMenuItems() {
        List<MenuItem> menuItems = Arrays.asList(new MenuItem(), new MenuItem());
        when(menuItemRepository.findAll()).thenReturn(menuItems);

        List<MenuItem> result = menuItemService.getAllMenuItems();

        assertEquals(2, result.size());
        verify(menuItemRepository).findAll();
    }

    @Test
    void testGetMenuItemById_found() {
        MenuItem menuItem = new MenuItem();
        menuItem.setId(1L);
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));

        Optional<MenuItem> result = menuItemService.getMenuItemById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(menuItemRepository).findById(1L);
    }

    @Test
    void testGetMenuItemById_notFound() {
        when(menuItemRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<MenuItem> result = menuItemService.getMenuItemById(1L);

        assertFalse(result.isPresent());
        verify(menuItemRepository).findById(1L);
    }

    @Test
    void testCreateMenuItem() {
        MenuItem menuItem = new MenuItem();
        menuItem.setName("Burger");

        when(menuItemRepository.save(menuItem)).thenReturn(menuItem);

        MenuItem created = menuItemService.createMenuItem(menuItem);

        assertEquals("Burger", created.getName());
        verify(menuItemRepository).save(menuItem);
    }

    @Test
    void testUpdateMenuItem_success() {
        MenuItem existing = new MenuItem();
        existing.setId(1L);
        existing.setName("Old Name");

        MenuItem updates = new MenuItem();
        updates.setName("New Name");

        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(menuItemRepository.save(any(MenuItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MenuItem updated = menuItemService.updateMenuItem(1L, updates);

        assertEquals("New Name", updated.getName());
        verify(menuItemRepository).findById(1L);
        verify(menuItemRepository).save(existing);
    }

    @Test
    void testUpdateMenuItem_notFound() {
        when(menuItemRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> menuItemService.updateMenuItem(1L, new MenuItem()));

        assertEquals("Menu item not found with id 1", ex.getMessage());
        verify(menuItemRepository).findById(1L);
        verify(menuItemRepository, never()).save(any());
    }

    @Test
    void testDeleteMenuItem_success() {
        MenuItem existing = new MenuItem();
        existing.setId(1L);

        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(existing));
        doNothing().when(menuItemRepository).delete(existing);

        menuItemService.deleteMenuItem(1L);

        verify(menuItemRepository).findById(1L);
        verify(menuItemRepository).delete(existing);
    }

    @Test
    void testDeleteMenuItem_notFound() {
        when(menuItemRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> menuItemService.deleteMenuItem(1L));

        assertEquals("Menu item not found with id 1", ex.getMessage());
        verify(menuItemRepository).findById(1L);
        verify(menuItemRepository, never()).delete(any());
    }

    @Test
    void testAddIngredientToMenuItem_success() {
        MenuItem menuItem = new MenuItem();
        menuItem.setId(1L);
        Ingredient ingredient = new Ingredient();
        ingredient.setId(2L);

        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));
        when(ingredientRepository.findById(2L)).thenReturn(Optional.of(ingredient));
        when(menuItemRepository.save(menuItem)).thenReturn(menuItem);

        MenuItem result = menuItemService.addIngredientToMenuItem(1L, 2L);

        assertTrue(result.getIngredients().contains(ingredient));
        verify(menuItemRepository).findById(1L);
        verify(ingredientRepository).findById(2L);
        verify(menuItemRepository).save(menuItem);
    }

    @Test
    void testRemoveIngredientFromMenuItem_success() {
        MenuItem menuItem = new MenuItem();
        menuItem.setId(1L);
        Ingredient ingredient = new Ingredient();
        ingredient.setId(2L);
        menuItem.addIngredient(ingredient); // assume this adds ingredient to internal collection

        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(menuItem));
        when(ingredientRepository.findById(2L)).thenReturn(Optional.of(ingredient));
        when(menuItemRepository.save(menuItem)).thenReturn(menuItem);

        MenuItem result = menuItemService.removeIngredientFromMenuItem(1L, 2L);

        assertFalse(result.getIngredients().contains(ingredient));
        verify(menuItemRepository).findById(1L);
        verify(ingredientRepository).findById(2L);
        verify(menuItemRepository).save(menuItem);
    }
}
