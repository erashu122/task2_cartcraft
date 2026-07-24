package com.cartcraft.dto.cart;

import com.cartcraft.dto.product.ProductResponse;
import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        BigDecimal lineTotal
) {
}
