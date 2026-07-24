package com.cartcraft.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateCartItemRequest(
        @NotNull Long itemId,
        @NotNull @Min(1) Integer quantity
) {
}
