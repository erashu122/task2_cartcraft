package com.cartcraft.dto.wishlist;

import jakarta.validation.constraints.NotNull;

public record WishlistRequest(
        @NotNull Long productId
) {
}
