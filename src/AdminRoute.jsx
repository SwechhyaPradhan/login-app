import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
        const role = userDocSnap.exists() ? userDocSnap.data().role : "customer";
        setIsAdmin(role === "admin");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}