"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { FiThumbsUp, FiMessageSquare } from "react-icons/fi";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const DiscussionPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "discussions"));
        const discussionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDiscussions(discussionsData);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) return <p>Loading discussions...</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Community Discussions</h1>

        <div className="flex justify-end mb-6">
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={() => router.push("/discussion/new")}
          >
            New Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-200 transform hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/discussion/detailed?id=${discussion.id}`)}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {discussion.title || "No Title Available"}
              </h2>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {discussion.content?.substring(0, 100) || "No Content Available"}...
              </p>

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
