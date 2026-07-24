package com.cartcraft.service;

import com.cartcraft.dto.product.ProductRequest;
import com.cartcraft.dto.product.ProductResponse;
import com.cartcraft.entity.Category;
import com.cartcraft.entity.Product;
import com.cartcraft.exception.ResourceNotFoundException;
import com.cartcraft.mapper.ProductMapper;
import com.cartcraft.repository.ProductRepository;
import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(
            String query,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 48), resolveSort(sort));
        return productRepository.findAll(buildSpecification(query, categoryId, minPrice, maxPrice), pageable)
                .map(ProductMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductMapper.toResponse(getProduct(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = categoryService.getById(request.categoryId());
        Product product = Product.builder()
                .title(clean(request.title()))
                .description(request.description().trim())
                .price(request.price())
                .stock(request.stock())
                .images(cleanImages(request.images()))
                .category(category)
                .build();
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProduct(id);
        product.setTitle(clean(request.title()));
        product.setDescription(request.description().trim());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setImages(cleanImages(request.images()));
        product.setCategory(categoryService.getById(request.categoryId()));
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Transactional(readOnly = true)
    public Product getProductEntity(Long id) {
        return getProduct(id);
    }

    private Specification<Product> buildSpecification(
            String query,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, criteriaQuery, builder) -> {
            if (!Long.class.equals(criteriaQuery.getResultType())) {
                root.fetch("category", JoinType.LEFT);
            }
            criteriaQuery.distinct(true);
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (query != null && !query.isBlank()) {
                String like = "%" + query.trim().toLowerCase() + "%";
                predicates.add(builder.or(
                        builder.like(builder.lower(root.get("title")), like),
                        builder.like(builder.lower(root.get("description")), like)
                ));
            }
            if (categoryId != null) {
                predicates.add(builder.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return builder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private Sort resolveSort(String sort) {
        return switch (sort == null ? "newest" : sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "stock" -> Sort.by(Sort.Direction.ASC, "stock");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private String clean(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private List<String> cleanImages(List<String> images) {
        if (images == null) {
            return List.of();
        }
        return images.stream()
                .filter(image -> image != null && !image.isBlank())
                .map(String::trim)
                .toList();
    }
}
