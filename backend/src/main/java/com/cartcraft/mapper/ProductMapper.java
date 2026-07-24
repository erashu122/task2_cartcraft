package com.cartcraft.mapper;

import com.cartcraft.dto.product.ProductResponse;
import com.cartcraft.entity.Product;

public final class ProductMapper {
    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImages(),
                CategoryMapper.toResponse(product.getCategory()),
                product.getRating(),
                product.getReviewCount(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
