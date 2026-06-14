import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "../context/CartContext";
import { ArrowLeft } from "lucide-react";
import { db, auth } from "../firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import KhaltiCheckout from "khalti-checkout-web";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(10, "Enter a complete delivery address"),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition mt-4"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const orderId = `order_${Date.now()}`;

      // Save order as pending
      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId: auth.currentUser?.uid || null,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        deliveryAddress: data.address,
        items: cartItems,
        totalAmount: totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Khalti config
      const config = {
        publicKey: process.env.REACT_APP_KHALTI_PUBLIC_KEY,
        productIdentity: orderId,
        productName: `Order-${orderId}`,
        productUrl: window.location.origin,
        paymentPreference: ["KHALTI"],
        eventHandler: {
          async onSuccess(payload) {
            // Update order status to completed
            await updateDoc(doc(db, "orders", orderId), {
              status: "Completed",
              khaltiToken: payload.token,
              khaltiIdx: payload.idx,
            });
            clearCart();
            navigate("/my-orders");
          },
          onError(error) {
            console.error("Khalti error:", error);
            alert("Payment failed. Please try again.");
          },
          onClose() {
            console.log("Khalti widget closed");
          },
        },
      };

      const checkout = new KhaltiCheckout(config);
      checkout.show({ amount: Math.round(totalPrice * 100) });

    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Checkout</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — Customer details form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Delivery Details
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2
                  focus:ring-blue-400 text-sm
                  ${errors.name ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2
                  focus:ring-blue-400 text-sm
                  ${errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="98XXXXXXXX"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2
                  focus:ring-blue-400 text-sm
                  ${errors.phone ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <textarea
                {...register("address")}
                placeholder="Street, City, Province"
                rows={3}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2
                  focus:ring-blue-400 text-sm resize-none
                  ${errors.address ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold
                py-3 rounded-xl transition duration-200 mt-2 disabled:opacity-60
                disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Loading..." : `Pay with Khalti — $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right — Order summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}