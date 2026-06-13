import { Bell, Menu, X, LogOut } from "lucide-react"; // 👈 add LogOut
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";                   // 👈 add this
import { signOut } from "firebase/auth";              // 👈 add this

export default function Navbar({ name, activeTab, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  // 👇 add this function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-gray-800 transition">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
          <p className="text-xs text-gray-400">Welcome back, {name}!</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>
        <button
  onClick={() => navigate("/my-orders")}
  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition duration-200"
>
  My Orders
</button>

        {/* 👇 add this logout button */}
        <button onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-xl text-sm font-medium transition duration-200">
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>
    </header>
  );
}