package com.cartcraft.dto.wishlist;

import com.cartcraft.dto.product.ProductResponse;
import java.time.Instant;

public record WishlistItemResponse(
        Long id,
        ProductResponse product,
        Instant createdAt
) {
}
