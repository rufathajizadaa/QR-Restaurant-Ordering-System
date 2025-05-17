//package com.qmenyu.restaurantordering.config;
//
//import com.qmenyu.restaurantordering.model.User;
//import com.qmenyu.restaurantordering.repository.UserRepository;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//public class DataInitializer {
//
//    @Bean
//    public ApplicationRunner init(UserRepository userRepo, PasswordEncoder encoder) {
//        return args -> {
//            if (userRepo.findByUsername("admin").isEmpty()) {
//                User admin = new User("admin", encoder.encode("admin123"), "admin@example.com");
//                admin.addAuthority(new SimpleGrantedAuthority("ROLE_ADMIN"));
//                userRepo.save(admin);
//            }
//
//            if (userRepo.findByUsername("user").isEmpty()) {
//                User user = new User("user", encoder.encode("12345"), "user@example.com");
//                userRepo.save(user);
//            }
//            if (userRepo.findByUsername("waiter").isEmpty()) {
//                userRepo.save(new User("waiter", encoder.encode("wait123"), "waiter@example.com")
//                        .addAuthority(new SimpleGrantedAuthority("ROLE_WAITER")));
//            }
//
//            if (userRepo.findByUsername("kitchen").isEmpty()) {
//                userRepo.save(new User("kitchen", encoder.encode("cook123"), "kitchen@example.com")
//                        .addAuthority(new SimpleGrantedAuthority("ROLE_KITCHEN")));
//            }
//        };
//    }
//}


package com.qmenyu.restaurantordering.config;

//import com.qmenyu.restaurantordering.model.User;
//import com.qmenyu.restaurantordering.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        if (userRepository.count() == 0) {
//            User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@example.com", "ROLE_ADMIN");
//            User waiter = new User("waiter", passwordEncoder.encode("waiter123"), "waiter@example.com", "ROLE_WAITER");
//            User kitchen = new User("kitchen", passwordEncoder.encode("kitchen123"), "kitchen@example.com", "ROLE_KITCHEN");
//            User guest = new User("guest", passwordEncoder.encode("guest123"), "guest@example.com", "ROLE_GUEST   ");
//
//            userRepository.save(admin);
//            userRepository.save(waiter);
//            userRepository.save(kitchen);
//            userRepository.save(guest);
//
//            System.out.println("🟢 Sample users created.");
//        }
//    }
//}
