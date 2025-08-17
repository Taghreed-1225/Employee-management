package com.example.employee_management.service;

import com.example.employee_management.dto.ApiResponse;
import com.example.employee_management.dto.LoginRequest;
import com.example.employee_management.dto.LoginResponse;
import com.example.employee_management.dto.RegisterRequest;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import com.example.employee_management.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public ApiResponse register(RegisterRequest request) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                return new ApiResponse(false, "Username already exists!");
            }

            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return new ApiResponse(false, "Email already exists!");
            }

            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setRole(User.Role.USER);

            userRepository.save(user);

            return new ApiResponse(true, "User registered successfully!");

        } catch (Exception e) {
            return new ApiResponse(false, "Registration failed: " + e.getMessage());
        }
    }

    public ApiResponse login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Get user details
            User user = (User) authentication.getPrincipal();

            // Generate JWT token
            String token = jwtUtil.generateToken(user);

            // Create response
            LoginResponse loginResponse = new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return new ApiResponse(true, "Login successful!", loginResponse);

        } catch (AuthenticationException e) {
            return new ApiResponse(false, "Invalid username or password!");
        } catch (Exception e) {
            return new ApiResponse(false, "Login failed: " + e.getMessage());
        }
    }

}