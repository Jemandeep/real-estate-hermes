"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "../../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 1. A minimal top-level component that wraps in <Suspense>
export default function NewPropertyDiscussionPage() {
  return (
    <Suspense fallback={<div>Loading new discussion form...</div>}>
      <NewPropertyDiscussionContent />
    </Suspense>
  );
}

// 2. The actual component logic, using useSearchParams, etc.
function NewPropertyDiscussionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id"); // Get listing ID from the query parameter

  const [userEmail, setUserEmail] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  // Ensure the user is logged in and fetch their email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const discussionsRef = collection(db, "listings", listingId, "discussions");
      await addDoc(discussionsRef, {
        content,
        createdAt: serverTimestamp(),
        createdBy: userEmail,
      });

      setLoading(false);
      router.push(`/community/property/detailed?id=${listingId}`);
    } catch (err) {
      console.error("Error creating discussion:", err);
      setError("Failed to create discussion. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Start a New Discussion for Listing
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-gray-700 font-semibold mb-2"
          >
            Discussion Content
          </label>
          <textarea
            id="content"
            className="w-full p-3 border rounded-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your discussion content here..."
            rows="6"
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating Discussion..." : "Create Discussion"}
        </button>
      </form>
    </div>
  );
}
