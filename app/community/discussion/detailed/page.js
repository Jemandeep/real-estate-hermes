"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import Layout from "../../../components/Layout";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function DetailedDiscussionPage() {
  return (
    <Suspense fallback={<p>Loading discussion...</p>}>
      <DetailedDiscussionContent />
    </Suspense>
  );
}

function DetailedDiscussionContent() {
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.email);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser({
              ...userSnap.data(),
              email: currentUser.email,
              userId: currentUser.uid,
            });
          } else {
            console.error("User not found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    const fetchDiscussion = async () => {
      if (!id) return;
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

  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, "discussions", id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "" || !user) return;

    const commentData = {
      content: newComment,
      createdBy: user.email,
      createdAt: serverTimestamp(),
      likedBy: [],
      dislikedBy: [],
    };

    try {
      const commentsRef = collection(db, "discussions", id, "comments");
      await addDoc(commentsRef, commentData);

      // Update comment count in discussion
      const discussionRef = doc(db, "discussions", id);
      await updateDoc(discussionRef, {
        commentCount: (discussion.commentCount || 0) + 1,
      });

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleLike = async (commentId) => {
    if (!user) return;
    const commentRef = doc(db, "discussions", id, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      const { likedBy = [], dislikedBy = [] } = commentSnap.data();
      const userObj = { userId: user.userId, email: user.email };

      const updateData = {};
      if (likedBy.some((like) => like.userId === user.userId)) {
        updateData.likedBy = arrayRemove(userObj);
      } else {
        updateData.likedBy = arrayUnion(userObj);
        if (dislikedBy.some((dislike) => dislike.userId === user.userId)) {
          updateData.dislikedBy = arrayRemove(userObj);
        }
      }
      await updateDoc(commentRef, updateData);
    }
  };

  const handleDislike = async (commentId) => {
    if (!user) return;
    const commentRef = doc(db, "discussions", id, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      const { likedBy = [], dislikedBy = [] } = commentSnap.data();
      const userObj = { userId: user.userId, email: user.email };

      const updateData = {};
      if (dislikedBy.some((dislike) => dislike.userId === user.userId)) {
        updateData.dislikedBy = arrayRemove(userObj);
      } else {
        updateData.dislikedBy = arrayUnion(userObj);
        if (likedBy.some((like) => like.userId === user.userId)) {
          updateData.likedBy = arrayRemove(userObj);
        }
      }
      await updateDoc(commentRef, updateData);
    }
  };

  if (loading) return <p>Loading discussion...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        {discussion && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h1 className="text-4xl font-semibold mb-4 text-gray-800">
              {discussion.title}
            </h1>
            <p className="text-gray-700 mb-6">{discussion.content}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-6">
              <p>👍 {discussion.likes || 0}</p>
              <p>💬 {discussion.commentCount || 0}</p>
              <p>
                📅 Created:{" "}
                {discussion.createdAt?.seconds
                  ? new Date(discussion.createdAt.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                ✏️ Last Edited:{" "}
                {discussion.editedAt?.seconds
                  ? new Date(discussion.editedAt.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Display Comments */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-4 mb-4">
                <p className="text-gray-800 mb-2">{comment.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <p>By: {comment.createdBy || "Unknown"}</p>
                    <p>
                      Created At:{" "}
                      {comment.createdAt?.seconds
                        ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      👍 <span className="ml-1">{comment.likedBy?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(comment.id)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      👎{" "}
                      <span className="ml-1">{comment.dislikedBy?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>

        {/* Add New Comment */}
        <form onSubmit={handleAddComment} className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Add a Comment
          </h2>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </Layout>
  );
}
