package com.qmenyu.restaurantordering.controller;

import com.qmenyu.restaurantordering.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {
    @GetMapping("/login")
    public String loginPage() {
        return "login"; // renders login.html
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();

        return Map.of(
                "username", user.getUsername(),
                "roles", user.getAuthorities() // list like: [{ authority: "ROLE_ADMIN" }]
        );
    }

}

