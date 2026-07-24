package com.cartcraft.service;

import com.cartcraft.dto.payment.CheckoutSessionResponse;
import com.cartcraft.entity.Order;
import com.cartcraft.entity.OrderItem;
import com.cartcraft.entity.User;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final OrderService orderService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    public CheckoutSessionResponse createCheckoutSession(User user) throws StripeException {
        Order order = orderService.createPendingOrderFromCart(user);
        try {
            SessionCreateParams.Builder params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .putMetadata("orderId", order.getId().toString())
                    .putMetadata("userId", user.getId().toString());

            for (OrderItem item : order.getItems()) {
                params.addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(item.getQuantity().longValue())
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(toCents(item.getPrice()))
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(item.getProduct().getTitle())
                                        .build())
                                .build())
                        .build());
            }

            Session session = Session.create(params.build());
            orderService.attachStripeSession(order.getId(), session.getId());
            return new CheckoutSessionResponse(order.getId(), session.getId(), session.getUrl());
        } catch (StripeException ex) {
            orderService.markPaymentFailedByOrderId(order.getId());
            throw ex;
        }
    }

    public void handleWebhook(String payload, String signatureHeader) throws SignatureVerificationException {
        Event event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new IllegalArgumentException("Could not deserialize Stripe session"));
            orderService.markPaidBySession(session.getId());
        }
        if ("checkout.session.expired".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new IllegalArgumentException("Could not deserialize Stripe session"));
            orderService.markPaymentFailedBySession(session.getId());
        }
    }

    private long toCents(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100)).longValueExact();
    }
}
