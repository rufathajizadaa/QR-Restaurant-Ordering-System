package com.qmenyu.restaurantordering.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        String redirectURL = "/menu"; // default fallback

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String role = authority.getAuthority();
            if (role.equals("ROLE_ADMIN")) {
                redirectURL = "/manager";
                break;
            } else if (role.equals("ROLE_WAITER")) {
                redirectURL = "/waiter";
                break;
            } else if (role.equals("ROLE_KITCHEN")) {
                redirectURL = "/kitchen";
                break;
            } else if(role.equals("ROLE_GUEST")) {
                redirectURL = "/menu";
                break;
            }
        }

//        response.sendRedirect(redirectURL);
    }
}
