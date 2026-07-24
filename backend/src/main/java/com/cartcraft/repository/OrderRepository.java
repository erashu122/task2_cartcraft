package com.cartcraft.repository;

import com.cartcraft.entity.Order;
import com.cartcraft.entity.OrderStatus;
import com.cartcraft.entity.PaymentStatus;
import com.cartcraft.entity.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

    Optional<Order> findByStripeSessionId(String stripeSessionId);

    long countByPaymentStatus(PaymentStatus paymentStatus);

    long countByOrderStatus(OrderStatus orderStatus);

    long countByUser(User user);

    @Query("select coalesce(sum(o.totalAmount), 0) from Order o where o.paymentStatus = com.cartcraft.entity.PaymentStatus.PAID")
    BigDecimal sumPaidRevenue();
}
