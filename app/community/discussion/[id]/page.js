"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const DetailedDiscussion = () => {
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Retrieve `id` from query parameters

  useEffect(() => {
    const fetchDiscussion = async () => {
      if (!id) return; // Ensure `id` is available
      try {
        const docRef = doc(db, "discussions", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDiscussion({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Discussion not found.");
        }
      } catch (err) {
        setError("Error fetching discussion details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [id]);

  if (loading) return <p>Loading discussion...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {discussion && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
            <p className="text-gray-700 mb-6">{discussion.content}</p>
            <div className="text-sm text-gray-500">
              <p>Likes: {discussion.likes || 0}</p>
              <p>Comments: {discussion.commentCount || 0}</p>
              <p>
                Created:{" "}
                {discussion.createdAt?.seconds
                  ? new Date(discussion.createdAt.seconds * 1000).toLocaleDateString()
                  : "Date not available"}
              </p>
              {discussion.editedAt?.seconds && (
                <p>
                  Last Edited: {new Date(discussion.editedAt.seconds * 1000).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DetailedDiscussion;
