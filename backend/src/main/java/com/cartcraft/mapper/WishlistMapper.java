package com.cartcraft.mapper;

import com.cartcraft.dto.wishlist.WishlistItemResponse;
import com.cartcraft.entity.WishlistItem;

public final class WishlistMapper {
    private WishlistMapper() {
    }

    public static WishlistItemResponse toResponse(WishlistItem item) {
        return new WishlistItemResponse(
                item.getId(),
                ProductMapper.toResponse(item.getProduct()),
                item.getCreatedAt()
        );
    }
}
