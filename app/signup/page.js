"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Ensure correct useRouter import from 'next/navigation' in Next.js 13+
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { auth, db } from "../../firebase"; // Ensure the path to your firebase.js is correct
import Link from "next/link";
import Layout from "../components/Layout";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Optional field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // State to track user role (default: user)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    if (typeof window !== "undefined") {
      // We are on the client-side
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Combine first and last name (if last name is provided)
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;

      // Set the role based on whether the user wants to be an agent or not
      const userRole = role === "agent" ? "pending_agent" : "user";

      // Store the user's full name, email, and role in Firestore
      await setDoc(doc(db, "users", email), {
        name: fullName,
        email: email,
        role: userRole, // Assign role (either user or pending_agent)
      });

      setSuccess("Signup successful! Redirecting to login page...");
      setError(""); // Clear error if any

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        if (router) {
          router.push("/login");
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Failed to create an account. Please try again.");
      setSuccess(""); // Clear success message if any
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Sign Up</h2>
          <form onSubmit={handleSignup} className="login-form">
            {/* First Name Field */}
            <div>
              <label htmlFor="firstName" className="login-input-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="login-input"
              />
            </div>

            {/* Last Name Field (Optional) */}
            <div>
              <label htmlFor="lastName" className="login-input-label">
                Last Name (Optional)
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="login-input"
              />
            </div>

            {/* Email Field */}
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-sm text-gray-600 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password Field with Show/Hide */}
            <div className="relative">
              <label htmlFor="confirm-password" className="login-input-label">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-9 text-sm text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Role Selection (User or Agent) */}
            <div>
              <label htmlFor="role" className="login-input-label">
                Sign up as:
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="login-input"
              >
                <option value="user">Regular User</option>
                <option value="agent">Agent</option>
              </select>
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
    </Layout>
  );
}
