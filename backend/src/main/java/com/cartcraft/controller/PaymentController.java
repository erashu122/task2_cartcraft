package com.cartcraft.controller;

import com.cartcraft.dto.payment.CheckoutSessionResponse;
import com.cartcraft.entity.User;
import com.cartcraft.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-session")
    public ResponseEntity<CheckoutSessionResponse> createSession(@AuthenticationPrincipal User user) throws StripeException {
        return ResponseEntity.ok(paymentService.createCheckoutSession(user));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(HttpServletRequest request) throws Exception {
        String payload = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
        String signature = request.getHeader("Stripe-Signature");
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }
}
