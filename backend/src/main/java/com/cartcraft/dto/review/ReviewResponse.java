package com.cartcraft.dto.review;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        Long productId,
        Long userId,
        String userName,
        Integer rating,
        String comment,
        Instant createdAt,
        Instant updatedAt
) {
}
