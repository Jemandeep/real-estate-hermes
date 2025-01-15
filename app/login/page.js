"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation"; // For redirection after login
import { auth } from "../../firebase";
import Link from "next/link";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [error, setError] = useState("");

  const router = useRouter(); // Initialize the useRouter hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Firebase authentication using email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After successful login, redirect to the main page
      router.push("/"); // Redirect to the main page or wherever you'd like
    } catch (error) {
      console.error("Login error:", error); // Log the full error
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Failed to login. Please check your credentials.");
      }
    }
  };

  return (
    <Layout>
      <div className="login-container min-h-screen flex items-center justify-center bg-gray-100">
        <div className="login-box max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="login-title text-2xl font-semibold mb-6 text-center">LOGIN</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="mb-4">
              <label htmlFor="email" className="login-input-label block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="login-input w-full p-2 border rounded"
              />
            </div>
            
            {/* Password Field with Show/Hide */}
            <div className="relative mb-4">
              <label htmlFor="password" className="login-input-label block text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="login-input w-full p-2 border rounded"
              />
              {/* Show/Hide Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-sm text-gray-600 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <button
              type="submit"
              className="login-button w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login Now
            </button>
            {error && <p className="error-message text-red-500 text-sm mt-2">{error}</p>}
          </form>
          <div className="mt-4 text-center">
            <p>Don&apos;t have an account?</p> 
            {/* ^ Replaced the apostrophe with &apos; */}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 transition duration-200">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
