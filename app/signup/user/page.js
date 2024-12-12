"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import Layout from "../../components/Layout";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

export default function UserSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the user information in Firestore
      await setDoc(doc(db, "users", email), {
        email: email,
        name: lastName ? `${firstName} ${lastName}` : firstName,
        role: "user", // Default role
      });

      alert("Signup successful!");
      router.push("/login");
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", error);
    }

    setLoading(false);
  };

  return (
    
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">User Signup</h2>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* First Name */}
            <div className="flex items-center">
              <FiUser className="text-gray-500 mr-2" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full p-3 border rounded"
              />
            </div>

            {/* Last Name (Optional) */}
            <div className="flex items-center">
              <FiUser className="text-gray-500 mr-2" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name (Optional)"
                className="w-full p-3 border rounded"
              />
            </div>

            {/* Email */}
            <div className="flex items-center">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full p-3 border rounded"
              />
            </div>

            {/* Password */}
            <div className="relative flex items-center">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-3 border rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2"
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-500" />
                ) : (
                  <FiEye className="text-gray-500" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative flex items-center">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full p-3 border rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2"
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-500" />
                ) : (
                  <FiEye className="text-gray-500" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    
  );
}
