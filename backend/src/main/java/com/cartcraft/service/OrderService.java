package com.cartcraft.service;

import com.cartcraft.dto.order.OrderResponse;
import com.cartcraft.dto.order.UpdateOrderStatusRequest;
import com.cartcraft.entity.Cart;
import com.cartcraft.entity.CartItem;
import com.cartcraft.entity.Order;
import com.cartcraft.entity.OrderItem;
import com.cartcraft.entity.OrderStatus;
import com.cartcraft.entity.PaymentStatus;
import com.cartcraft.entity.Product;
import com.cartcraft.entity.User;
import com.cartcraft.exception.BadRequestException;
import com.cartcraft.exception.ResourceNotFoundException;
import com.cartcraft.mapper.OrderMapper;
import com.cartcraft.repository.CartRepository;
import com.cartcraft.repository.OrderRepository;
import com.cartcraft.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createPendingOrder(User user) {
        return OrderMapper.toResponse(createPendingOrderFromCart(user));
    }

    @Transactional
    public Order createPendingOrderFromCart(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PLACED)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findLockedById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            if (cartItem.getQuantity() > product.getStock()) {
                throw new BadRequestException("Only " + product.getStock() + " items are available for " + product.getTitle());
            }

            product.setStock(product.getStock() - cartItem.getQuantity());
            BigDecimal price = product.getPrice();
            total = total.add(price.multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(price)
                    .build();
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        cart.getItems().clear();
        return saved;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findMyOrders(User user) {
        return orderRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findMineById(User user, Long id) {
        return OrderMapper.toResponse(orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return OrderMapper.toResponse(getOrder(id));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateStatus(UpdateOrderStatusRequest request) {
        Order order = getOrder(request.orderId());
        order.setOrderStatus(request.status());
        return OrderMapper.toResponse(order);
    }

    @Transactional
    public void attachStripeSession(Long orderId, String sessionId) {
        Order order = getOrder(orderId);
        order.setStripeSessionId(sessionId);
    }

    @Transactional
    public OrderResponse markPaidBySession(String sessionId) {
        Order order = orderRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for Stripe session"));
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return OrderMapper.toResponse(order);
        }
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.PLACED);
        order.setPaidAt(Instant.now());
        return OrderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse markPaymentFailedBySession(String sessionId) {
        Order order = orderRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for Stripe session"));
        return failPendingOrder(order);
    }

    @Transactional
    public OrderResponse markPaymentFailedByOrderId(Long orderId) {
        Order order = getOrder(orderId);
        return failPendingOrder(order);
    }

    private OrderResponse failPendingOrder(Order order) {
        if (order.getPaymentStatus() == PaymentStatus.PAID || order.getPaymentStatus() == PaymentStatus.FAILED) {
            return OrderMapper.toResponse(order);
        }

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findLockedById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            product.setStock(product.getStock() + item.getQuantity());
        }
        order.setPaymentStatus(PaymentStatus.FAILED);
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        return OrderMapper.toResponse(order);
    }

    private Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }
}
