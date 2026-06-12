import { useDroppable } from "@dnd-kit/core";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";

export default function CartSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    totalItems
  } = useCart();

  // useDroppable — makes this sidebar a drop zone
  // When a card is dragged here, onDragEnd in ProductsPage will handle it
  const { isOver, setNodeRef } = useDroppable({
    id: "cart-sidebar"
  });

  return (
    <>
      {/* Overlay — clicking outside closes sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-gray-800">Cart</h2>
            {totalItems > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Drop zone area */}
        <div
          ref={setNodeRef}
          className={`mx-4 mt-4 mb-2 border-2 border-dashed rounded-xl p-3 text-center
            transition-all duration-200
            ${isOver
              ? "border-blue-400 bg-blue-50 scale-105"  // highlight when card is dragged over
              : "border-gray-200 bg-gray-50"
            }`}
        >
          <p className="text-xs text-gray-400">
            {isOver ? "🎯 Drop here!" : "⠿ Drag products here"}
          </p>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ maxHeight: "calc(100vh - 280px)" }}>

          {cartItems.length === 0 ? (
            // Empty cart message
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
              <p className="text-gray-300 text-xs mt-1">
                Drag products or click Add to Cart
              </p>
            </div>
          ) : (
            // Cart items
            cartItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                {/* Product image */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-blue-500 font-medium mt-0.5">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                    >
                      <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="text-xs font-bold text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                    >
                      <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer — total and checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="font-bold text-gray-800">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-200"
            >
              Checkout ({totalItems} items)
            </button>
          </div>
        )}
      </div>
    </>
  );
}