
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
import { FiMessageSquare, FiStar, FiActivity } from "react-icons/fi";
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

          {/* Reviews Card
          <Link href="/community/reviews" aria-label="Reviews">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiStar className="text-2xl text-gray-800 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
              </div>
              <p className="text-gray-600">Read or leave reviews for agents and properties, helping others make informed decisions.</p>
            </div>
          </Link> */}

          {/* Activity Feed Card */}
          {/* <Link href="/community/activityFeed" aria-label="Activity Feed">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <FiActivity className="text-2xl text-gray-800 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Activity Feed</h2>
              </div>
              <p className="text-gray-600">Stay updated with trending posts, discussions, and community interactions.</p>
            </div>
          </Link> */}
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
