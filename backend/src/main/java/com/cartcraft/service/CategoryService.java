package com.cartcraft.service;

import com.cartcraft.dto.category.CategoryRequest;
import com.cartcraft.dto.category.CategoryResponse;
import com.cartcraft.entity.Category;
import com.cartcraft.exception.ConflictException;
import com.cartcraft.exception.ResourceNotFoundException;
import com.cartcraft.mapper.CategoryMapper;
import com.cartcraft.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String name = normalizeName(request.name());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Category already exists");
        }
        Category category = categoryRepository.save(Category.builder().name(name).build());
        return CategoryMapper.toResponse(category);
    }

    @Transactional(readOnly = true)
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private String normalizeName(String name) {
        return name.trim().replaceAll("\\s+", " ");
    }
}
