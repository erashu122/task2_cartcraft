package com.cartcraft.controller;

import com.cartcraft.dto.order.OrderResponse;
import com.cartcraft.dto.order.UpdateOrderStatusRequest;
import com.cartcraft.entity.User;
import com.cartcraft.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> findMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.findMyOrders(user));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.createPendingOrder(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> findMineById(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.findMineById(user, id));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> findAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateStatus(@Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(request));
    }
}
