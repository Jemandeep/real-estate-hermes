"use client"
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure the path to your firebase.js is correct
import Link from "next/link"; // Import Link for navigation

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Signup successful! You can now log in.");
      setError(""); // Clear error if any
    } catch (error) {
      setError("Failed to create an account. Please try again.");
      setSuccess(""); // Clear success message if any
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign Up</h2>
        <form onSubmit={handleSignup} className="login-form">
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
            Sign Up
          </button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="text-green-500 text-xs italic mt-4">{success}</p>}
        </form>

        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 transition duration-200">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
