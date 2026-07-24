package com.cartcraft.mapper;

import com.cartcraft.dto.cart.CartItemResponse;
import com.cartcraft.dto.cart.CartResponse;
import com.cartcraft.entity.Cart;
import com.cartcraft.entity.CartItem;
import java.math.BigDecimal;
import java.util.List;

public final class CartMapper {
    private CartMapper() {
    }

    public static CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(CartMapper::toItemResponse)
                .toList();
        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = items.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        return new CartResponse(cart.getId(), items, totalItems, subtotal);
    }

    private static CartItemResponse toItemResponse(CartItem item) {
        BigDecimal lineTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getId(),
                ProductMapper.toResponse(item.getProduct()),
                item.getQuantity(),
                lineTotal
        );
    }
}
