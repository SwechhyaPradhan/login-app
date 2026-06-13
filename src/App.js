import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./AuthPage";
import HomePage from "./HomePage";
import ProductsPage from "./pages/ProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./ProtectedRoute";
import PaymentVerifyPage from "./pages/PaymentVerifyPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminRoute from "./AdminRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/checkout/verify" element={<PaymentVerifyPage />} />
        {/* Auth */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboard - protected */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        {/* My Orders - protected */}
<Route path="/my-orders" element={
  <ProtectedRoute>
    <MyOrdersPage />
  </ProtectedRoute>
} />

        {/* Product Details - protected */}
        <Route path="/products/:id" element={
        <ProtectedRoute>
          <ProductDetailPage />
        </ProtectedRoute>
        } />

        
<Route path="/admin" element={
  <AdminRoute>
    <AdminDashboardPage />
  </AdminRoute>
} />

        {/* Products - protected */}
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } />

        {/* Checkout - protected */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;