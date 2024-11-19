
// Here's a concise summary of the prompts used to create the CommunityPage:

// User Authentication: Ensure only logged-in users can access the page; redirect unauthenticated users to /login.
// Loading State: Display a "Loading..." message while verifying user authentication status.
// Page Layout and Title: Add a prominent "Community Page" title at the top.
// Interactive Section Cards:
// Create cards for Discussion Forum, Reviews, and Activity Feed with icons, titles, and descriptions.
// Make each card link to its respective page and add hover effects for engagement.
// Responsive Design: Set up a responsive grid layout for the cards to adjust from one to three columns based on screen size.
// Styling: Style the cards with rounded corners, shadows, and a scaling hover transition to make the page visually appealing and interactive.

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation for App Router
import Link from "next/link";
import Layout from "../components/Layout";
import { FiMessageSquare, FiStar, FiActivity,FiBarChart2 } from "react-icons/fi";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase auth

const CommunityPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if logged in
        setLoading(false);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Community Page</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Discussion Forum Card */}
          <Link href="/community/discussion" aria-label="Discussion Forum">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiMessageSquare className="text-2xl text-gray-800 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Discussion Forum</h2>
              </div>
              <p className="text-gray-600">Join discussions on real estate topics, neighborhoods, and property trends.</p>
            </div>
          </Link>

          {/* Property Discussion */}
          <Link href="/community/property" aria-label="Discuss Prooperties">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiStar className="text-2xl text-gray-800 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Discuss Properties</h2>
              </div>
              <p className="text-gray-600">Talk Paricularly about properties</p>
            </div>
          </Link>

          {/* Polls Card */}
<Link href="/community/polls" aria-label="Polls">
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
    <div className="flex items-center mb-4">
      <FiBarChart2 className="text-2xl text-gray-800 mr-3" /> {/* Replace FiActivity with FiBarChart2 or any other poll-related icon */}
      <h2 className="text-xl font-bold text-gray-800">Polls</h2>
    </div>
    <p className="text-gray-600">Participate in polls created by agents and share your feedback with the community.</p>
  </div>
</Link>

        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;