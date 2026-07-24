package com.cartcraft.repository;

import com.cartcraft.entity.Cart;
import com.cartcraft.entity.CartItem;
import com.cartcraft.entity.Product;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
