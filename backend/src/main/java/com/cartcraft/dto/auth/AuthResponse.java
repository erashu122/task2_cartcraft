package com.cartcraft.dto.auth;

import com.cartcraft.entity.Role;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email,
        Role role
) {
}
