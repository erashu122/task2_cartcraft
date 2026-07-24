package com.cartcraft.repository;

import com.cartcraft.entity.Cart;
import com.cartcraft.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
