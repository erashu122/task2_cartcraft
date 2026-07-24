package com.cartcraft.dto.admin;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal revenue,
        Long totalOrders,
        Long totalProducts,
        Long totalCustomers,
        Long pendingOrders,
        Long lowStockCount,
        List<TopProductResponse> topSellingProducts,
        List<LowStockProductResponse> lowStockProducts
) {
}
