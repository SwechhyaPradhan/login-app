import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";

import Sidebar        from "./components/Sidebar";
import Navbar         from "./components/Navbar";
import StatCard       from "./components/StatCard";
import RecentActivity from "./components/RecentActivity";
import QuickStats     from "./components/QuickStats";
import OrdersTable    from "./components/OrdersTable";

const stats = [
  { title: "Total Users",  value: "12,430",  icon: Users,        color: "bg-blue-500",   change: "↑ 12% this month" },
  { title: "Total Orders", value: "8,210",   icon: ShoppingCart, color: "bg-purple-500", change: "↑ 8% this month"  },
  { title: "Revenue",      value: "$94,200", icon: DollarSign,   color: "bg-green-500",  change: "↑ 22% this month" },
  { title: "Growth Rate",  value: "18.6%",   icon: TrendingUp,   color: "bg-orange-500", change: "↑ 5% this month"  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const name = localStorage.getItem("loggedInUser") || "User";
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    toast.info("Logged out successfully! 👋");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar
          name={name}
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RecentActivity />
            <QuickStats />
          </div>

          <OrdersTable />
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}