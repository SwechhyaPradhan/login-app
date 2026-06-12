import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success(`Welcome back! 🎉`);
        setTimeout(() => navigate("/home"), 1500); // 👈 make sure "/home" matches your App.jsx route
      } catch (error) {
        // ✅ FIXED - correct error code for newer Firebase versions
        if (error.code === "auth/invalid-credential") {
          toast.error("Invalid email or password! ❌");
        } else {
          toast.error(error.message);
        }
      }

    } else {
      try {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Account created! Please login. 🎉");
        setIsLogin(true);
        reset();
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email already registered! Please login. ❌");
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          {isLogin ? "Login to your account" : "Register a new account"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                {...register("name", { required: "Full name is required." })}
                type="text"
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email."
                }
              })}
              type="email"
              placeholder="john@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 8, message: "Password must be at least 8 characters." }
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-400" : "border-gray-300"}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 text-sm">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                {...register("confirm", {
                  required: "Please confirm your password.",
                  validate: value => value === password || "Passwords do not match."
                })}
                type="password"
                placeholder="Repeat your password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.confirm ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
            </div>
          )}

          {isLogin && (
            <div className="text-right mb-4">
              <span className="text-blue-500 text-sm cursor-pointer hover:underline">Forgot Password?</span>
            </div>
          )}

          <button type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={switchMode}
            className="text-blue-500 font-medium cursor-pointer hover:underline ml-1">
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}