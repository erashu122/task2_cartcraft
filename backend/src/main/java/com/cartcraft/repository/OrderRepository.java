package com.cartcraft.repository;

import com.cartcraft.entity.Order;
import com.cartcraft.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

    Optional<Order> findByStripeSessionId(String stripeSessionId);
}
