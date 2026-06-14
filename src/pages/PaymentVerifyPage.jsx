import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useCart } from "../context/CartContext";

export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      const pidx = searchParams.get("pidx");

      if (!pidx) {
        setStatus("failed");
        return;
      }

      try {
        // Call verify serverless function
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pidx }),
        });

        const result = await response.json();

        if (result.status === "Completed") {
          // Find order by pidx or purchase_order_id and update status
          
          const q = query(
            collection(db, "orders"),
            where("status", "==", "pending")
          );
          const snapshot = await getDocs(q);

          // Update the most recent pending order
          if (!snapshot.empty) {
            const orderDoc = snapshot.docs[0];
            await updateDoc(doc(db, "orders", orderDoc.id), {
              status: "Completed",
              pidx,
              paidAt: new Date(),
            });
          }

          clearCart();
          setStatus("success");

          setTimeout(() => navigate("/my-orders"), 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
        {status === "verifying" && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-400 text-sm mt-2">Please wait</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-400 text-sm mt-2">Redirecting to your orders...</p>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-600">Payment Failed</h2>
            <p className="text-gray-400 text-sm mt-2">Something went wrong</p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}