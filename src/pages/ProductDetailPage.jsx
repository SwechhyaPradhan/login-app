import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const product = products.find(p => String(p.id) === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition mt-4"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isInCart = cartItems.some(item => item.id === product.id);
  const inWishlist = isInWishlist(product.id);

  const discountedPrice = product.discountPercentage
    ? (product.price - (product.price * product.discountPercentage) / 100).toFixed(2)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left — Product image */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full max-h-[400px] object-contain rounded-xl"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
            }}
          />
        </div>

        {/* Right — Product details */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {product.title}
          </h1>

          {/* Rating + stock */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-gray-700 text-sm font-medium">{product.rating}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-sm">{product.stock} in stock</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {discountedPrice ? (
              <>
                <span className="text-blue-600 font-bold text-2xl">${discountedPrice}</span>
                <span className="text-gray-300 text-sm line-through ml-2">${product.price}</span>
                <span className="ml-2 text-red-500 text-sm font-semibold">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            ) : (
              <span className="text-blue-600 font-bold text-2xl">${product.price}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-auto">
            <button
              onClick={() => addToCart(product)}
              className={`flex-1 font-semibold py-3 rounded-xl transition duration-200
                ${isInCart
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              {isInCart ? "✓ Added to Cart" : "+ Add to Cart"}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className={`p-3 rounded-xl border transition duration-200
                ${inWishlist
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"
                }`}
            >
              <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}