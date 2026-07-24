package com.cartcraft.service;

import com.cartcraft.dto.auth.AuthResponse;
import com.cartcraft.dto.user.ChangePasswordRequest;
import com.cartcraft.dto.user.UpdateProfileRequest;
import com.cartcraft.entity.User;
import com.cartcraft.exception.BadRequestException;
import com.cartcraft.exception.ConflictException;
import com.cartcraft.repository.UserRepository;
import com.cartcraft.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse updateProfile(User user, UpdateProfileRequest request) {
        String email = request.email().trim().toLowerCase();
        userRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new ConflictException("Email is already registered");
        });
        user.setName(request.name().trim().replaceAll("\\s+", " "));
        user.setEmail(email);
        User saved = userRepository.save(user);
        return new AuthResponse(
                jwtService.generateToken(saved),
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole()
        );
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
