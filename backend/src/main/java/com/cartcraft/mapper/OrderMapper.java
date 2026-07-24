package com.cartcraft.mapper;

import com.cartcraft.dto.order.OrderItemResponse;
import com.cartcraft.dto.order.OrderResponse;
import com.cartcraft.entity.Order;
import com.cartcraft.entity.OrderItem;
import java.math.BigDecimal;

public final class OrderMapper {
    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getStripeSessionId(),
                order.getCreatedAt(),
                order.getPaidAt(),
                order.getCancelledAt(),
                order.getItems().stream().map(OrderMapper::toItemResponse).toList()
        );
    }

    private static OrderItemResponse toItemResponse(OrderItem item) {
        BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new OrderItemResponse(
                item.getId(),
                ProductMapper.toResponse(item.getProduct()),
                item.getQuantity(),
                item.getPrice(),
                lineTotal
        );
    }
}
