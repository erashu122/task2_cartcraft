package com.cartcraft.service;

import com.cartcraft.dto.review.ReviewRequest;
import com.cartcraft.dto.review.ReviewResponse;
import com.cartcraft.entity.Product;
import com.cartcraft.entity.Review;
import com.cartcraft.entity.User;
import com.cartcraft.mapper.ReviewMapper;
import com.cartcraft.repository.ProductRepository;
import com.cartcraft.repository.ReviewRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> findByProduct(Long productId) {
        Product product = productService.getProductEntity(productId);
        return reviewRepository.findAllByProductOrderByCreatedAtDesc(product).stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse save(User user, ReviewRequest request) {
        Product product = productService.getProductEntity(request.productId());
        Review review = reviewRepository.findByUserAndProduct(user, product)
                .orElseGet(() -> Review.builder()
                        .user(user)
                        .product(product)
                        .build());
        review.setRating(request.rating());
        review.setComment(request.comment().trim());
        Review saved = reviewRepository.save(review);
        updateProductRating(product);
        return ReviewMapper.toResponse(saved);
    }

    private void updateProductRating(Product product) {
        List<Review> reviews = reviewRepository.findAllByProductOrderByCreatedAtDesc(product);
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        product.setRating(Math.round(average * 10.0) / 10.0);
        product.setReviewCount(reviews.size());
        productRepository.save(product);
    }
}
