package com.cartcraft.controller;

import com.cartcraft.dto.wishlist.WishlistItemResponse;
import com.cartcraft.dto.wishlist.WishlistRequest;
import com.cartcraft.entity.User;
import com.cartcraft.service.WishlistService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> findAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.findAll(user));
    }

    @PostMapping
    public ResponseEntity<List<WishlistItemResponse>> add(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody WishlistRequest request
    ) {
        return ResponseEntity.ok(wishlistService.add(user, request));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<List<WishlistItemResponse>> remove(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(wishlistService.remove(user, productId));
    }
}
