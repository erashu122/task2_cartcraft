package com.cartcraft.mapper;

import com.cartcraft.dto.review.ReviewResponse;
import com.cartcraft.entity.Review;

public final class ReviewMapper {
    private ReviewMapper() {
    }

    public static ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
