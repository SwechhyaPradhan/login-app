import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/ProductList";
import ErrorBoundary from "../components/ErrorBoundary";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">🛍️ Shop</h1>
          <p className="text-gray-400 text-sm mt-1">
            Drag products to cart or click Add to Cart
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ProductList
            products={products}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}