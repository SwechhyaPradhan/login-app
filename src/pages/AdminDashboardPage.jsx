import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
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

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const statusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-600";
      case "pending": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const totalRevenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-xl text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-gray-400 text-sm">Completed Orders</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {orders.filter(o => o.status === "Completed").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">All Orders</h2>
          </div>

          {loading ? (
            <p className="text-gray-400 text-center py-12">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="px-5 py-3 font-medium">Order ID</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Items</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-700 font-medium">{order.orderId}</td>
                      <td className="px-5 py-3 text-gray-700">{order.customerName}</td>
                      <td className="px-5 py-3 text-gray-500">{order.customerEmail}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="px-5 py-3 font-bold text-gray-800">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}