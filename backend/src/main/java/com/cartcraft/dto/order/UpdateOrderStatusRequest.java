package com.cartcraft.dto.order;

import com.cartcraft.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull Long orderId,
        @NotNull OrderStatus status
) {
}
