import { Home, ShoppingBag, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${active ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export default function Sidebar({ activeTab, isOpen, onLogout }) {
  const navigate = useNavigate();

  const navLinks = [
    { icon: Home,        label: "Dashboard", path: "/home" },
    { icon: ShoppingBag, label: "Shop",      path: "/products" },
    
  ];

  return (
    <aside
      className={`
        h-screen sticky top-0 flex-shrink-0 flex flex-col
        bg-white border-r border-gray-100 shadow-sm
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? "w-64 px-3 py-6" : "w-0 px-0 py-0"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 mb-8 whitespace-nowrap">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-800">MyShop</span>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1 whitespace-nowrap">
        {navLinks.map(link => (
          <SidebarLink
            key={link.label}
            icon={link.icon}
            label={link.label}
            active={activeTab === link.label}
            onClick={() => navigate(link.path)}
          />
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full whitespace-nowrap">
        <LogOut className="w-5 h-5 flex-shrink-0" />
        Logout
      </button>
    </aside>
  );
}