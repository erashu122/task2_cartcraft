package com.cartcraft.dto.admin;

import java.math.BigDecimal;

public record TopProductResponse(
        Long productId,
        String title,
        Long unitsSold,
        BigDecimal revenue
) {
}
