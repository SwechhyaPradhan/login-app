import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const CartContext = createContext();

// 2. CartProvider wraps your whole app and provides cart state to every component
export function CartProvider({ children }) {

  // Load cart from localStorage on first render (so cart persists on refresh)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        // If already in cart, increase quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // If new product, add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart completely
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Increase quantity of a product
  const increaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity — remove if quantity reaches 0
  const decreaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  // Total number of items in cart
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalPrice,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

// 3. Custom hook to use cart anywhere in your app
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}