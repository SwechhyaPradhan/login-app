import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCart, Heart, Package, DollarSign, ArrowRight } from "lucide-react";

import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  const name = auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "User";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setOrderCount(orders.length);
        setRecentOrders(orders.slice(0, 3));

        const spent = orders
          .filter(o => o.status === "Completed")
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        setTotalSpent(spent);
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
    toast.info("Logged out successfully! 👋");
    setTimeout(() => navigate("/"), 1500);
  };

  const stats = [
    { title: "Cart Items",   value: totalItems,               icon: ShoppingCart, color: "bg-blue-500" },
    { title: "Wishlist",     value: wishlistItems.length,     icon: Heart,        color: "bg-pink-500" },
    { title: "My Orders",    value: orderCount,               icon: Package,      color: "bg-purple-500" },
    { title: "Total Spent",  value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "bg-green-500" },
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-600";
      case "pending": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        activeTab="Dashboard"
        isOpen={sidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar
          name={name}
          activeTab="Dashboard"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-6 flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition text-left"
            >
              <div>
                <p className="font-semibold text-gray-800">Browse Products</p>
                <p className="text-xs text-gray-400 mt-1">Discover new items</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
            </button>

          

          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
              <button
                onClick={() => navigate("/my-orders")}
                className="text-sm text-blue-500 hover:underline"
              >
                View all
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet. Start shopping!</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Order #{order.orderId}</p>
                      <p className="text-xs text-gray-400">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">${order.totalAmount?.toFixed(2)}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}