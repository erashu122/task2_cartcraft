package com.cartcraft.service;

import com.cartcraft.dto.admin.CustomerResponse;
import com.cartcraft.dto.admin.DashboardResponse;
import com.cartcraft.dto.admin.LowStockProductResponse;
import com.cartcraft.dto.admin.TopProductResponse;
import com.cartcraft.entity.OrderStatus;
import com.cartcraft.entity.Product;
import com.cartcraft.entity.Role;
import com.cartcraft.entity.User;
import com.cartcraft.repository.OrderItemAnalyticsRepository;
import com.cartcraft.repository.OrderRepository;
import com.cartcraft.repository.ProductRepository;
import com.cartcraft.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private static final int LOW_STOCK_THRESHOLD = 5;

    private final OrderRepository orderRepository;
    private final OrderItemAnalyticsRepository orderItemAnalyticsRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                orderRepository.sumPaidRevenue(),
                orderRepository.count(),
                productRepository.count(),
                userRepository.countByRole(Role.CUSTOMER),
                orderRepository.countByOrderStatus(OrderStatus.PLACED),
                productRepository.countByStockLessThanEqual(LOW_STOCK_THRESHOLD),
                getTopSellingProducts(),
                getLowStockProducts()
        );
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getCustomers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.CUSTOMER)
                .map(this::toCustomerResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LowStockProductResponse> getLowStockProducts() {
        return productRepository.findTop10ByStockLessThanEqualOrderByStockAsc(LOW_STOCK_THRESHOLD).stream()
                .map(this::toLowStockResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopProductResponse> getTopSellingProducts() {
        return orderItemAnalyticsRepository.findTopSellingProducts(PageRequest.of(0, 5)).stream()
                .map(row -> new TopProductResponse(
                        (Long) row[0],
                        (String) row[1],
                        ((Number) row[2]).longValue(),
                        (BigDecimal) row[3]
                ))
                .toList();
    }

    private CustomerResponse toCustomerResponse(User user) {
        return new CustomerResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                orderRepository.countByUser(user)
        );
    }

    private LowStockProductResponse toLowStockResponse(Product product) {
        return new LowStockProductResponse(
                product.getId(),
                product.getTitle(),
                product.getStock(),
                product.getPrice(),
                product.getCategory().getName()
        );
    }
}
