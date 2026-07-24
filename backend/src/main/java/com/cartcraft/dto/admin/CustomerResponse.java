package com.cartcraft.dto.admin;

import com.cartcraft.entity.Role;
import java.time.Instant;

public record CustomerResponse(
        Long id,
        String name,
        String email,
        Role role,
        Instant createdAt,
        Long orderCount
) {
}
