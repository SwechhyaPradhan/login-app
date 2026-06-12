import { useState } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import CartSidebar from "./CartSidebar";
import LoadingSkeleton from "./LoadingSkeleton";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

const PRODUCTS_PER_PAGE = 8;

export default function ProductList({ products, loading, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const { addToCart, totalItems } = useCart();

  // Calculate pagination
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  // Called when drag starts — track which product is being dragged
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveProduct(active.data.current?.product);
  };

  // Called when drag ends — if dropped on cart, add to cart
  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveProduct(null);

    // Only add to cart if dropped on cart-sidebar drop zone
    if (over && over.id === "cart-sidebar") {
      const product = active.data.current?.product;
      if (product) {
        addToCart(product);
        setCartOpen(true); // open cart to show item was added
      }
    }
  };

  // Handle page change — scroll to top
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} products found
          </p>
        </div>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-blue-500 hover:bg-blue-600
            text-white px-4 py-2 rounded-xl font-medium transition"
        >
          <ShoppingCart className="w-4 h-4" />
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white
              text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Drag overlay — shows card while dragging */}
      <DragOverlay>
        {activeProduct && (
          <div className="bg-white rounded-2xl shadow-2xl p-3 w-48 opacity-90 rotate-3">
            <img
              src={activeProduct.thumbnail}
              alt={activeProduct.title}
              className="w-full h-28 object-cover rounded-xl mb-2"
            />
            <p className="text-xs font-semibold text-gray-800 line-clamp-1">
              {activeProduct.title}
            </p>
            <p className="text-xs text-blue-500 font-bold mt-1">
              ${activeProduct.price}
            </p>
          </div>
        )}
      </DragOverlay>

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </DndContext>
  );
}