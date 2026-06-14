import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ name, activeTab, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {/* Toggle button — always visible, clean icon swap */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
          <p className="text-xs text-gray-400">Welcome back, {name}!</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
       

        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>

      

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-xl text-sm font-medium transition duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}