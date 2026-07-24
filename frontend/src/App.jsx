import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ProfilePage from './pages/account/ProfilePage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import CartPage from './pages/cart/CartPage.jsx';
import ProductDetailsPage from './pages/catalog/ProductDetailsPage.jsx';
import ProductListPage from './pages/catalog/ProductListPage.jsx';
import OrderDetailsPage from './pages/orders/OrderDetailsPage.jsx';
import OrderHistoryPage from './pages/orders/OrderHistoryPage.jsx';
import OrderSuccessPage from './pages/orders/OrderSuccessPage.jsx';
import WishlistPage from './pages/wishlist/WishlistPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/cart"
            element={(
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/wishlist"
            element={(
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/orders"
            element={(
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/orders/:id"
            element={(
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/order-success"
            element={(
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            )}
          />
        </Route>

        <Route
          path="/admin"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
