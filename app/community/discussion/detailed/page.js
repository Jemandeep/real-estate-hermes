"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../firebase';
import Layout from '../../../components/Layout';

const DetailedDiscussion = () => {
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Placeholder user ID and email (Replace with actual user ID and email from auth context)
  const userId = "currentUserId";
  const [userEmail, setUserEmail] = useState("user@example.com");

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchDiscussion = async () => {
      if (!id) return;
      try {
        // Fetch discussion details
        const docRef = doc(db, 'discussions', id);
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

    // Fetch discussion details
    fetchDiscussion();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, 'discussions', id, 'comments');
    
    // Real-time listener for comments collection
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [id]);

  // Fetch user email based on user ID
  useEffect(() => {
    const fetchUserEmail = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserEmail(userSnap.data().email);
      }
    };
    fetchUserEmail();
  }, [userId]);

  const handleLike = async (commentId) => {
    const commentRef = doc(db, 'discussions', id, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      const { likedBy = [], dislikedBy = [] } = commentSnap.data();
      const userObj = { userId, email: userEmail };

      const updateData = {};
      if (likedBy.some(user => user.userId === userId)) {
        // Undo like
        updateData.likedBy = arrayRemove(userObj);
      } else {
        // Add like and remove dislike if it exists
        updateData.likedBy = arrayUnion(userObj);
        if (dislikedBy.some(user => user.userId === userId)) {
          updateData.dislikedBy = arrayRemove(userObj);
        }
      }

      await updateDoc(commentRef, updateData);
    }
  };

  const handleDislike = async (commentId) => {
    const commentRef = doc(db, 'discussions', id, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      const { likedBy = [], dislikedBy = [] } = commentSnap.data();
      const userObj = { userId, email: userEmail };

      const updateData = {};
      if (dislikedBy.some(user => user.userId === userId)) {
        // Undo dislike
        updateData.dislikedBy = arrayRemove(userObj);
      } else {
        // Add dislike and remove like if it exists
        updateData.dislikedBy = arrayUnion(userObj);
        if (likedBy.some(user => user.userId === userId)) {
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
      <div className="container mx-auto p-6">
        {discussion && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
            <p className="text-gray-700 mb-6">{discussion.content}</p>
            <p className="text-sm text-gray-500">Likes: {discussion.likes || 0}</p>
            <p className="text-sm text-gray-500">Comments: {discussion.commentCount || 0}</p>
            <p className="text-sm text-gray-500">
              Created At: {discussion.createdAt?.seconds ? new Date(discussion.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Last Edited: {discussion.editedAt?.seconds ? new Date(discussion.editedAt.seconds * 1000).toLocaleDateString() : "N/A"}
            </p>
          </div>
        )}

        {/* Display Comments */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-gray-800 mb-2">{comment.content}</p>
                <p className="text-sm text-gray-500">By: {comment.createdBy || "Unknown"}</p>
                <p className="text-sm text-gray-500">
                  Created At: {comment.createdAt?.seconds ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`text-sm ${comment.likedBy?.some(user => user.userId === userId) ? 'text-blue-500' : 'text-gray-500'}`}
                  >
                    👍 {comment.likedBy ? comment.likedBy.length : 0}
                  </button>
                  <button
                    onClick={() => handleDislike(comment.id)}
                    className={`text-sm ${comment.dislikedBy?.some(user => user.userId === userId) ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    👎 {comment.dislikedBy ? comment.dislikedBy.length : 0}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DetailedDiscussion;
