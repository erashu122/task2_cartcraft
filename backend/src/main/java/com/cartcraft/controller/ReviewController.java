package com.cartcraft.controller;

import com.cartcraft.dto.review.ReviewRequest;
import com.cartcraft.dto.review.ReviewResponse;
import com.cartcraft.entity.User;
import com.cartcraft.service.ReviewService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/{productId}")
    public ResponseEntity<List<ReviewResponse>> findByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.findByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> save(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.save(user, request));
    }
}
