package com.cartcraft.controller;

import com.cartcraft.dto.cart.AddCartItemRequest;
import com.cartcraft.dto.cart.CartResponse;
import com.cartcraft.dto.cart.UpdateCartItemRequest;
import com.cartcraft.entity.User;
import com.cartcraft.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItem(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.addItem(user, request));
    }

    @PutMapping
    public ResponseEntity<CartResponse> updateItem(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItem(user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(cartService.removeItem(user, id));
    }

    @DeleteMapping
    public ResponseEntity<CartResponse> clear(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.clear(user));
    }
}
