# CartCraft

CartCraft is a full stack e-commerce application built as a production-style portfolio project. It includes a responsive storefront, JWT authentication, RBAC-protected admin tools, persistent cart and wishlist, Stripe Checkout, webhook-confirmed payments, order management, product reviews, and sales analytics.

Repository: https://github.com/erashu122/task2_cartcraft

## Status

- Module 1: Project foundation, backend authentication/RBAC, frontend auth shell - complete
- Module 2: Catalog, categories, filters, product details - complete
- Module 3: Cart, wishlist, persistent cart - complete
- Module 4: Checkout, orders, Stripe webhook confirmation - complete
- Module 5: Reviews, ratings, user profile - complete
- Module 6: Admin dashboard, inventory, analytics - complete
- Module 7: Polish, docs, deployment, screenshots - complete

## Tech Stack

Frontend:

- React 19 with Vite
- Tailwind CSS
- React Router DOM
- Redux Toolkit
- Axios
- React Hook Form
- React Hot Toast
- Lucide React

Backend:

- Java 21
- Spring Boot 3
- Spring Security
- JWT authentication
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok
- Bean Validation
- Stripe Java SDK
- Springdoc OpenAPI

Deployment targets:

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

## Features

Customer:

- Register/login as customer or admin
- Protected routes
- Product listing with search, category filter, price filter, sorting, and pagination
- Product details with image gallery
- Wishlist
- Persistent cart
- Stripe Checkout session creation
- Order success page
- Order history and order details
- Product reviews and star ratings
- Profile edit
- Change password

Admin:

- RBAC-protected admin area
- Create categories
- Create/delete products
- View orders
- Update order status
- View customers
- Sales analytics
- Revenue summary
- Top selling products
- Low stock alerts
- Inventory alert page

Security and reliability:

- BCrypt password hashing
- JWT bearer authentication
- Role based authorization
- Server-side validation
- Global exception handling
- CORS configuration
- JPA query binding against SQL injection
- Stateless API sessions
- Stripe webhook verification
- Orders are marked paid only from verified Stripe webhook events
- Product stock is locked with pessimistic write during checkout to reduce overselling risk

## Local Setup

### Prerequisites

- Java 21
- Maven
- Node.js 20+
- PostgreSQL
- Stripe account for real checkout testing

### Database

Create a PostgreSQL database:

```sql
CREATE DATABASE cartcraft;
```

### Backend

```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

If you prefer npm:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/cartcraft
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=replace-with-a-strong-256-bit-secret
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
STRIPE_SUCCESS_URL=http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:5173/cart
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Stripe Webhook

For local testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:8080/api/payment/webhook
```

Copy the webhook signing secret into:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

CartCraft trusts Stripe webhook confirmation, not frontend redirect success.

## API Reference

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Users:

- `GET /api/users/me`
- `PUT /api/users/me`
- `PUT /api/users/password`

Products:

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` admin
- `PUT /api/products/{id}` admin
- `DELETE /api/products/{id}` admin

Categories:

- `GET /api/categories`
- `POST /api/categories` admin

Cart:

- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart`
- `DELETE /api/cart/{id}`
- `DELETE /api/cart`

Wishlist:

- `GET /api/wishlist`
- `POST /api/wishlist`
- `DELETE /api/wishlist/{productId}`

Orders:

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `GET /api/orders/admin/all` admin
- `PUT /api/orders/status` admin

Reviews:

- `POST /api/reviews`
- `GET /api/reviews/{productId}`

Payments:

- `POST /api/payment/create-session`
- `POST /api/payment/webhook`

Admin:

- `GET /api/admin/dashboard`
- `GET /api/admin/customers`
- `GET /api/admin/inventory/low-stock`
- `GET /api/admin/top-products`

OpenAPI:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Project Structure

```text
cartcraft
  backend
    src/main/java/com/cartcraft
      config
      controller
      dto
      entity
      exception
      mapper
      repository
      security
      service
    src/main/resources
      application.yml
  frontend
    src
      components
      hooks
      layouts
      pages
      redux
      services
      utils
```

## Screenshots

Add screenshots here after running the app:

- Home page: `docs/screenshots/home.png`
- Product listing: `docs/screenshots/products.png`
- Product details and reviews: `docs/screenshots/product-details.png`
- Cart: `docs/screenshots/cart.png`
- Order history: `docs/screenshots/orders.png`
- Admin dashboard: `docs/screenshots/admin-dashboard.png`
- Admin products: `docs/screenshots/admin-products.png`

## Deployment Guide

### Backend on Render

1. Create a new Render Web Service.
2. Connect the GitHub repository.
3. Set root directory to `backend`.
4. Build command:

```bash
mvn clean package -DskipTests
```

5. Start command:

```bash
java -jar target/cartcraft-0.0.1-SNAPSHOT.jar
```

6. Add backend environment variables from `.env.example`.
7. Set `CORS_ALLOWED_ORIGINS` to the deployed Vercel URL.

### Frontend on Vercel

1. Import the GitHub repository.
2. Set root directory to `frontend`.
3. Build command:

```bash
pnpm run build
```

4. Output directory:

```text
dist
```

5. Add:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

### PostgreSQL

Use Render PostgreSQL, Supabase, Neon, or Railway. Set `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` on Render.

## Internship Requirement Checklist

- Storefront with filters and search: complete
- Product pages: complete
- Persistent cart: complete
- Stripe Checkout: complete
- Customer order history: complete
- Admin order management: complete
- RBAC-protected admin panel: complete
- Product reviews and ratings: complete
- Prevent overselling during simultaneous checkouts: implemented with pessimistic product locking
- Confirm payments only through Stripe webhooks: complete

## Known Local Tooling Note

Frontend build was verified successfully. Backend compilation could not be run in the current machine environment because Maven is not installed or not available on `PATH`.

## Future Improvements

- Refresh token rotation
- Coupon system
- Product update form in admin panel
- Cloudinary product image uploads
- Email order confirmations
- Recently viewed products
- Related products
- Infinite scroll option
- More granular audit logs for admin actions
