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
    try {
      // Firebase authentication using email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After successful login, redirect to the main page
      router.push("/"); // Redirect to the main page or wherever you'd like

    } catch (error) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">LOGIN</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div>
              <label htmlFor="email" className="login-input-label">
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
                className="login-input"
              />
            </div>
            
            {/* Password Field with Show/Hide */}
            <div className="relative">
              <label htmlFor="password" className="login-input-label">
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
                className="login-input"
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
            
            <button type="submit" className="login-button">
              Login Now
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
          <div className="mt-4 text-center">
            <p>Don't have an account?</p>
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 transition duration-200">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
