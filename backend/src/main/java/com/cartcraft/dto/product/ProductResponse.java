package com.cartcraft.dto.product;

import com.cartcraft.dto.category.CategoryResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        String title,
        String description,
        BigDecimal price,
        Integer stock,
        List<String> images,
        CategoryResponse category,
        Double rating,
        Integer reviewCount,
        Instant createdAt,
        Instant updatedAt
) {
}
