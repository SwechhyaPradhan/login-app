import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/ProductList";
import ErrorBoundary from "../components/ErrorBoundary";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  // ✅ Same pattern as HomePage
  const name = auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex">

        <Sidebar
          activeTab="Shop"
          isOpen={isOpen}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col">
          <Navbar
            name={name}          // ✅ now passes real name
            activeTab="Shop"
            sidebarOpen={isOpen}
            setSidebarOpen={setIsOpen}
          />

          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            <ProductList
              products={products}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}