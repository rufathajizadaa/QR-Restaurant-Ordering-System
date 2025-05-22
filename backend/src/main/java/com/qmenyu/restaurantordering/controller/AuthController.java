package com.qmenyu.restaurantordering.controller;

import com.qmenyu.restaurantordering.model.User;
import com.qmenyu.restaurantordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        return Map.of(
                "username", user.getUsername(),
                "roles", user.getAuthorities()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_" + user.getRole().toUpperCase());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
}
