import { useDraggable } from "@dnd-kit/core";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();

  // Check if product is already in cart
  const isInCart = cartItems.some(item => item.id === product.id);

  // useDraggable hook from dnd-kit
  // Makes this card draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: product.id,
    data: { product } // pass product data so CartSidebar knows what was dropped
  });

  // Apply transform style while dragging
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  // Discount price calculation
  const discountedPrice = product.discountPercentage
    ? (product.price - (product.price * product.discountPercentage) / 100).toFixed(2)
    : null;

  const navigate = useNavigate();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200
        ${isDragging
          ? "shadow-2xl scale-105 opacity-80 ring-2 ring-blue-400"  // style while dragging
          : "hover:shadow-md hover:-translate-y-1"                   // style on hover
        }
        ${isInCart ? "ring-2 ring-green-400" : ""}                   // green border if in cart
      `}
    >
      {/* Drag handle area — top image section */}
      <div
        {...listeners}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {/* Product image */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />

        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-white text-xs font-medium text-gray-600 px-2 py-1 rounded-full shadow-sm capitalize">
          {product.category}
        </span>

        {/* Discount badge */}
        {product.discountPercentage && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        {/* In cart badge */}
        {isInCart && (
          <span className="absolute bottom-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ In Cart
          </span>
        )}

        {/* Drag hint */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded-full">
          ⠿ Drag to cart
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-gray-600 text-xs font-medium">{product.rating}</span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="text-gray-400 text-xs">{product.stock} in stock</span>
        </div>

        {/* Price and Add to Cart button */}
        <div className="flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <>
                <span className="text-blue-600 font-bold text-sm">${discountedPrice}</span>
                <span className="text-gray-300 text-xs line-through ml-1">${product.price}</span>
              </>
            ) : (
              <span className="text-blue-600 font-bold text-sm">${product.price}</span>
            )}
          </div>

        {/* Add to cart button */}
<button
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product);
  }}
  className={`text-xs font-medium px-3 py-2 rounded-xl transition duration-200
    ${isInCart
      ? "bg-green-100 text-green-600 hover:bg-green-200"
      : "bg-blue-500 text-white hover:bg-blue-600"
    }`}
>
  {isInCart ? "✓ Added" : "+ Add to Cart"}
</button>
        </div>
      </div>
    </div>
  );
}