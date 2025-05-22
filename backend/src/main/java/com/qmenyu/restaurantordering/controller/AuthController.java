package com.qmenyu.restaurantordering.controller;

import com.qmenyu.restaurantordering.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
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
                "roles", user.getAuthorities() // e.g. [{ authority: "ROLE_ADMIN" }]
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // TODO: Validate user input, hash password, save to DB, etc.

        // For now, just a placeholder response:
        System.out.println("Registering user: " + user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered");
    }
}
