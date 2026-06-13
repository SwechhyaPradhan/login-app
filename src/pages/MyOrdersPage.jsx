import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-600";
      case "pending": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">My Orders</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-400">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Order #{order.orderId}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-sm font-bold text-gray-800">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}