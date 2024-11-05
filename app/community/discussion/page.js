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
          <h1 className="text-4xl font-bold mb-8 text-center">Community Discussions</h1>
  
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