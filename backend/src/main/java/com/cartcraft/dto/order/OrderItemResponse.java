package com.cartcraft.dto.order;

import com.cartcraft.dto.product.ProductResponse;
import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        BigDecimal price,
        BigDecimal lineTotal
) {
}
