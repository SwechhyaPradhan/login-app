import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("Verifying your payment...");

  useEffect(() => {
  const pidx = searchParams.get("pidx");
  const purchaseOrderId = searchParams.get("purchase_order_id");

  if (!pidx) {
    setStatus("Invalid payment reference.");
    return;
  }

  const verify = httpsCallable(functions, "verifyKhaltiPayment");

  verify({ pidx })
    .then(async (res) => {
      const paymentStatus = res.data.status;

      if (purchaseOrderId) {
        await updateDoc(doc(db, "orders", purchaseOrderId), {
          status: paymentStatus, // "Completed", "Pending", "Expired", etc.
          pidx,
        });
      }

      if (paymentStatus === "Completed") {
        setStatus("Payment Successful! 🎉");
        clearCart();
      } else {
        setStatus(`Payment ${paymentStatus}. Please try again.`);
      }
    })
    .catch((err) => {
      console.error(err);
      setStatus("Could not verify payment. Please contact support.");
    });
}, [searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{status}</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition mt-2"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}