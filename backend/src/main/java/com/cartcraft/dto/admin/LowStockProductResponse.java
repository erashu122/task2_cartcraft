package com.cartcraft.dto.admin;

import java.math.BigDecimal;

public record LowStockProductResponse(
        Long productId,
        String title,
        Integer stock,
        BigDecimal price,
        String categoryName
) {
}
