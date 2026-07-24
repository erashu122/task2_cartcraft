package com.cartcraft.service;

import com.cartcraft.dto.cart.AddCartItemRequest;
import com.cartcraft.dto.cart.CartResponse;
import com.cartcraft.dto.cart.UpdateCartItemRequest;
import com.cartcraft.entity.Cart;
import com.cartcraft.entity.CartItem;
import com.cartcraft.entity.Product;
import com.cartcraft.entity.User;
import com.cartcraft.exception.BadRequestException;
import com.cartcraft.exception.ResourceNotFoundException;
import com.cartcraft.mapper.CartMapper;
import com.cartcraft.repository.CartItemRepository;
import com.cartcraft.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    @Transactional
    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return CartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse addItem(User user, AddCartItemRequest request) {
        Cart cart = getOrCreateCart(user);
        Product product = productService.getProductEntity(request.productId());
        int quantity = request.quantity();
        validateStock(product, quantity);

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseGet(() -> {
                    CartItem created = CartItem.builder()
                            .cart(cart)
                            .product(product)
                            .quantity(0)
                            .build();
                    cart.getItems().add(created);
                    return created;
                });

        int nextQuantity = item.getQuantity() + quantity;
        validateStock(product, nextQuantity);
        item.setQuantity(nextQuantity);
        cartItemRepository.save(item);
        return CartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(User user, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getId().equals(request.itemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        validateStock(item.getProduct(), request.quantity());
        item.setQuantity(request.quantity());
        return CartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cart.getItems().remove(item);
        return CartMapper.toResponse(cart);
    }

    @Transactional
    public CartResponse clear(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        return CartMapper.toResponse(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(buildCart(user)));
    }

    private Cart buildCart(User user) {
        return Cart.builder()
                .user(user)
                .build();
    }

    private void validateStock(Product product, int quantity) {
        if (quantity > product.getStock()) {
            throw new BadRequestException("Only " + product.getStock() + " items are available");
        }
    }
}
