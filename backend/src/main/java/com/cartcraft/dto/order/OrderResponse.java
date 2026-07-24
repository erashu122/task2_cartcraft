package com.cartcraft.dto.order;

import com.cartcraft.entity.OrderStatus;
import com.cartcraft.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus,
        OrderStatus orderStatus,
        String stripeSessionId,
        Instant createdAt,
        Instant paidAt,
        Instant cancelledAt,
        List<OrderItemResponse> items
) {
}
