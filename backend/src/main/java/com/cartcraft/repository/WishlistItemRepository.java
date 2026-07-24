package com.cartcraft.repository;

import com.cartcraft.entity.Product;
import com.cartcraft.entity.User;
import com.cartcraft.entity.WishlistItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findAllByUserOrderByCreatedAtDesc(User user);

    Optional<WishlistItem> findByUserAndProduct(User user, Product product);

    boolean existsByUserAndProduct(User user, Product product);
}
