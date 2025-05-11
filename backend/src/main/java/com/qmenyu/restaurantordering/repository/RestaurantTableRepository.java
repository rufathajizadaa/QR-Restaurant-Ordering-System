package com.qmenyu.restaurantordering.repository;

import com.qmenyu.restaurantordering.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    // We can add custom queries here if needed
}
