"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const DetailedPropertyDiscussion = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get('id'); // Get listing ID from URL query

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  // Fetch current user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Fetch discussions from the `listings/{listingId}/discussions` subcollection
  useEffect(() => {
    if (!listingId) return;

    const discussionsRef = collection(db, 'listings', listingId, 'discussions');
    const unsubscribe = onSnapshot(discussionsRef, (snapshot) => {
      const fetchedDiscussions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiscussions(fetchedDiscussions);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching discussions:", err);
      setError("Failed to load discussions. Please try again later.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listingId]);

  const handleLike = async (discussionId) => {
    if (!user) return;

    const discussionRef = doc(db, 'listings', listingId, 'discussions', discussionId);
    const discussion = discussions.find(d => d.id === discussionId);
    const { likedBy = [], dislikedBy = [] } = discussion;

    const userObj = { uid: user.uid, email: user.email };
    const updateData = {};

    // Toggle like
    if (likedBy.some((like) => like.uid === user.uid)) {
      updateData.likedBy = arrayRemove(userObj);
    } else {
      updateData.likedBy = arrayUnion(userObj);
      if (dislikedBy.some((dislike) => dislike.uid === user.uid)) {
        updateData.dislikedBy = arrayRemove(userObj);
      }
    }

    await updateDoc(discussionRef, updateData);
  };

  const handleDislike = async (discussionId) => {
    if (!user) return;

    const discussionRef = doc(db, 'listings', listingId, 'discussions', discussionId);
    const discussion = discussions.find(d => d.id === discussionId);
    const { likedBy = [], dislikedBy = [] } = discussion;

    const userObj = { uid: user.uid, email: user.email };
    const updateData = {};

    // Toggle dislike
    if (dislikedBy.some((dislike) => dislike.uid === user.uid)) {
      updateData.dislikedBy = arrayRemove(userObj);
    } else {
      updateData.dislikedBy = arrayUnion(userObj);
      if (likedBy.some((like) => like.uid === user.uid)) {
        updateData.likedBy = arrayRemove(userObj);
      }
    }

    await updateDoc(discussionRef, updateData);
  };

  if (loading) return <p>Loading discussions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Discussions for Listing</h1>

        {/* Display Existing Discussions */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Existing Discussions</h2>
          {discussions.length > 0 ? (
            discussions.map((discussion) => {
              const isLiked = discussion.likedBy?.some((like) => like.uid === user?.uid);
              const isDisliked = discussion.dislikedBy?.some((dislike) => dislike.uid === user?.uid);

              return (
                <div key={discussion.id} className="bg-white rounded-lg p-4 mb-4 shadow-md">
                  <p>{discussion.content}</p>
                  <p className="text-sm text-gray-500">
                    Posted by: {discussion.createdBy || 'Unknown'} on{' '}
                    {discussion.createdAt?.seconds
                      ? new Date(discussion.createdAt.seconds * 1000).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleLike(discussion.id)}
                      className={`flex items-center ${isLiked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600`}
                    >
                      👍 <span className="ml-1">{discussion.likedBy?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(discussion.id)}
                      className={`flex items-center ${isDisliked ? 'text-red-500' : 'text-gray-500'} hover:text-red-600`}
                    >
                      👎 <span className="ml-1">{discussion.dislikedBy?.length || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">No discussions available for this listing.</p>
          )}
        </div>

        {/* Add New Discussion Button */}
        <div className="text-right">
          <button
            onClick={() => router.push(`/community/property/new?id=${listingId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Discussion
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DetailedPropertyDiscussion;
