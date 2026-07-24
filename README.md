# CartCraft

CartCraft is a production-oriented full stack e-commerce application built with React, Spring Boot, PostgreSQL, JWT authentication, RBAC, and Stripe-ready architecture.

## Module Status

- Module 1: Project foundation, backend authentication/RBAC, frontend auth shell - complete
- Module 2: Catalog, categories, filters, product details - complete
- Module 3: Cart, wishlist, persistent cart - complete
- Module 4: Checkout, orders, Stripe webhook confirmation - complete
- Module 5: Reviews, ratings, user profile - complete
- Module 6: Admin dashboard, inventory, analytics - pending
- Module 7: Polish, docs, deployment, screenshots - pending

## Tech Stack

Frontend: React 19, Vite, Tailwind CSS, React Router DOM, Axios, React Hook Form, Redux Toolkit, React Hot Toast, Lucide React.

Backend: Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA, PostgreSQL, Maven, Lombok, Validation, OpenAPI.

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

### Frontend

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
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Documentation

When the backend is running, OpenAPI documentation is available at:

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

Screenshots will be added after the UI modules are complete.

## Deployment

- Frontend: deploy the `frontend` app to Vercel.
- Backend: deploy the `backend` Spring Boot app to Render.
- Database: provision PostgreSQL and set the Render environment variables.

## Future Improvements

- Refresh token rotation
- Coupon campaigns and usage limits
- Cloudinary image uploads
- Email order confirmations
- Advanced analytics exports
