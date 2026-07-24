package com.cartcraft.service;

import com.cartcraft.dto.wishlist.WishlistItemResponse;
import com.cartcraft.dto.wishlist.WishlistRequest;
import com.cartcraft.entity.Product;
import com.cartcraft.entity.User;
import com.cartcraft.entity.WishlistItem;
import com.cartcraft.mapper.WishlistMapper;
import com.cartcraft.repository.WishlistItemRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductService productService;

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> findAll(User user) {
        return wishlistItemRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(WishlistMapper::toResponse)
                .toList();
    }

    @Transactional
    public List<WishlistItemResponse> add(User user, WishlistRequest request) {
        Product product = productService.getProductEntity(request.productId());
        if (!wishlistItemRepository.existsByUserAndProduct(user, product)) {
            wishlistItemRepository.save(WishlistItem.builder()
                    .user(user)
                    .product(product)
                    .build());
        }
        return findAll(user);
    }

    @Transactional
    public List<WishlistItemResponse> remove(User user, Long productId) {
        Product product = productService.getProductEntity(productId);
        wishlistItemRepository.findByUserAndProduct(user, product)
                .ifPresent(wishlistItemRepository::delete);
        return findAll(user);
    }
}
