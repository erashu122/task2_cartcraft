package com.cartcraft.dto.payment;

public record CheckoutSessionResponse(
        Long orderId,
        String sessionId,
        String checkoutUrl
) {
}
