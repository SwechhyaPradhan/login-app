import { Home, Users, BarChart2, FileText, Settings, LogOut } from "lucide-react";

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${active ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const navLinks = [
  { icon: Home,      label: "Dashboard" },
  { icon: Users,     label: "Users"     },
  { icon: BarChart2, label: "Analytics" },
  { icon: FileText,  label: "Reports"   },
  { icon: Settings,  label: "Settings"  },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, onLogout }) {
  return (
    <aside className={`${isOpen ? "w-64" : "w-0 overflow-hidden"} transition-all duration-300 bg-white border-r border-gray-100 flex flex-col py-6 px-3 shadow-sm`}>

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 mb-8">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-800">AdminPanel</span>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navLinks.map(link => (
          <SidebarLink
            key={link.label}
            icon={link.icon}
            label={link.label}
            active={activeTab === link.label}
            onClick={() => setActiveTab(link.label)}
          />
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}