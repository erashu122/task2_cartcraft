package com.cartcraft.mapper;

import com.cartcraft.dto.category.CategoryResponse;
import com.cartcraft.entity.Category;

public final class CategoryMapper {
    private CategoryMapper() {
    }

    public static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
