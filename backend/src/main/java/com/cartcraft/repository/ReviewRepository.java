package com.cartcraft.repository;

import com.cartcraft.entity.Product;
import com.cartcraft.entity.Review;
import com.cartcraft.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByProductOrderByCreatedAtDesc(Product product);

    Optional<Review> findByUserAndProduct(User user, Product product);
}
