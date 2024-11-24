// Here's a summary of the prompts and instructions i used to the creation of the DiscussionPage component:

// Fetching Discussions from Firestore:

// You wanted a page to display a list of community discussions.
// I set up the code to fetch discussions from the discussions collection in Firestore using getDocs.
// Each discussion document retrieved is mapped into an array, which is then stored in the discussions state.
// Error Handling and Loading State:

// You requested handling for loading and error states.
// A loading message is displayed while fetching data, and an error message is shown if the fetching fails.
// Display Discussion Cards:

// Each discussion is displayed as a card with specific details:
// Title: Displays the title of the discussion or "No Title Available" if absent.
// Content Preview: Shows the first 100 characters of the content as a preview.
// Cards are laid out in a responsive grid, with different numbers of columns for various screen sizes.
// Icons for Interactivity:

// You wanted indicators for likes and comments, so I added a thumbs-up icon for likes and a message icon for comments.
// Each icon displays the count of likes and comments, defaulting to 0 if these values are missing.
// Date Formatting:

// Each discussion card includes a date, formatted from the Firestore timestamp (createdAt). If createdAt is unavailable, it shows "Date not available."
// Link to Detailed View:

// Each card links to a detailed view of the discussion, using the discussion ID as a query parameter.
// When a user clicks on a card, they’re redirected to /community/discussion/detailed?id=discussionId.
// "Start New Discussion" Button:

// You wanted a button for users to start a new discussion.
// The button is styled with a hover effect and scaling animation and links to /community/discussion/new.
// Styling:

// The page uses a clean, centered layout with padding around the content.
// Cards are styled with rounded corners and a shadow effect for a modern, clickable design.

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { FiThumbsUp, FiMessageSquare } from "react-icons/fi";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from 'next/link';

const DiscussionPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'discussions'));
        const discussionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDiscussions(discussionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setError("Failed to load discussions. Please try again.");
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) return <p>Loading discussions...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Community Discussions</h1>
          <Link href="/community/discussion/new">
            <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105">
              + Start New Discussion
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="relative bg-white shadow-lg rounded-lg p-6 min-h-[250px] flex flex-col justify-between">
              <Link href={`/community/discussion/detailed?id=${discussion.id}`}>
                <div className="cursor-pointer">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {discussion.title || "No Title Available"}
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {discussion.content ? `${discussion.content.substring(0, 100)}...` : "No Content Available"}
                  </p>
                </div>
              </Link>
              
              <div className="flex items-center justify-between text-gray-500 mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FiThumbsUp className="mr-1" />
                    <span>{discussion.likes || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMessageSquare className="mr-1" />
                    <span>{discussion.commentCount || 0}</span>
                  </div>
                </div>
                <p className="text-sm">
                  {discussion.createdAt?.seconds
                    ? new Date(discussion.createdAt.seconds * 1000).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DiscussionPage;
