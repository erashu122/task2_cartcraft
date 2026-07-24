package com.cartcraft.controller;

import com.cartcraft.dto.admin.CustomerResponse;
import com.cartcraft.dto.admin.DashboardResponse;
import com.cartcraft.dto.admin.LowStockProductResponse;
import com.cartcraft.dto.admin.TopProductResponse;
import com.cartcraft.service.AdminDashboardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(adminDashboardService.getDashboard());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerResponse>> customers() {
        return ResponseEntity.ok(adminDashboardService.getCustomers());
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<LowStockProductResponse>> lowStock() {
        return ResponseEntity.ok(adminDashboardService.getLowStockProducts());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> topProducts() {
        return ResponseEntity.ok(adminDashboardService.getTopSellingProducts());
    }
}
