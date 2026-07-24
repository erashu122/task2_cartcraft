package com.cartcraft.dto.auth;

import com.cartcraft.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 80) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 120) String password,
        @NotNull Role role
) {
}
