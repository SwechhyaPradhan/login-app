import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // ✅ still checking Firebase auth state
  if (user === undefined) return <p>Loading...</p>;

  // ✅ if logged in → show dashboard, if not → back to login
  return user ? children : <Navigate to="/" />;
}