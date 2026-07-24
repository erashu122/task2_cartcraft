package com.cartcraft.repository;

import com.cartcraft.entity.OrderItem;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemAnalyticsRepository extends JpaRepository<OrderItem, Long> {
    @Query("""
            select oi.product.id, oi.product.title, sum(oi.quantity), sum(oi.price * oi.quantity)
            from OrderItem oi
            where oi.order.paymentStatus = com.cartcraft.entity.PaymentStatus.PAID
            group by oi.product.id, oi.product.title
            order by sum(oi.quantity) desc
            """)
    List<Object[]> findTopSellingProducts(Pageable pageable);
}
