"use client"
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure the path to your firebase.js is correct
import Link from "next/link"; // Import Link for navigation

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase authentication using email and password
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
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
          <div>
            <label htmlFor="password" className="login-input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="login-input"
            />
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
  );
}