"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function DetailedPropertyDiscussionPage() {
  return (
    <Suspense fallback={<div>Loading property details...</div>}>
      <DetailedPropertyDiscussionContent />
    </Suspense>
  );
}

function DetailedPropertyDiscussionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("id");

  const [discussions, setDiscussions] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (!listingId) return;
    const discussionsRef = collection(db, "listings", listingId, "discussions");
    const unsubscribe = onSnapshot(
      discussionsRef,
      (snapshot) => {
        const fetchedDiscussions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDiscussions(fetchedDiscussions);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching discussions:", err);
        setError("Failed to load discussions. Please try again later.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [listingId]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!listingId) return;
      try {
        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Property not found.");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Error fetching property details.");
      }
    };
    fetchProperty();
  }, [listingId]);

  const handleLike = async (discussionId) => {
    if (!user) return;
    const discussionRef = doc(db, "listings", listingId, "discussions", discussionId);
    const discussion = discussions.find((d) => d.id === discussionId);
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
    const discussionRef = doc(db, "listings", listingId, "discussions", discussionId);
    const discussion = discussions.find((d) => d.id === discussionId);
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold text-gray-700">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="text-center">No property found.</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white">
        <h1 className="text-4xl font-extrabold text-center text-[#0A2647] mb-10">
          {property.address}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Images */}
          <div className="w-full h-full rounded-lg overflow-hidden border-2 border-[#144272]">
            {property?.images?.length > 0 ? (
              property.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Property Image ${index + 1}`}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover rounded"
                />
              ))
            ) : (
              <div className="flex justify-center items-center bg-gray-100">
                <p className="text-[#144272]">No images available for this property.</p>
              </div>
            )}
          </div>

          {/* Right Column: Property Details */}
          <div className="grid grid-cols-2 gap-6 text-3xl font-bold text-black bg-[#f9f9f9] p-6 rounded-lg shadow">
            <div>
              <p className="font-bold text-lg">Bathrooms:</p>
              <p>{property.bathroom_count}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Bedrooms:</p>
              <p>{property.bed_count}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Price:</p>
              <p>${parseInt(property.current_price).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Neighborhood:</p>
              <p>{property.neighborhood}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Property Type:</p>
              <p>{property.property_type}</p>
            </div>
          </div>
        </div>

        {/* Discussions Section */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-4">Discussions</h2>
          {discussions.length > 0 ? (
            discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white rounded-lg p-4 mb-4 shadow-md"
              >
                <p>{discussion.content}</p>
                <p className="text-sm text-gray-500">
                  Posted by: {discussion.createdBy || "Unknown"} on{" "}
                  {discussion.createdAt?.seconds
                    ? new Date(discussion.createdAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleLike(discussion.id)}
                    className={`flex items-center ${
                      discussion.likedBy?.some((like) => like.uid === user?.uid)
                        ? "text-blue-500"
                        : "text-gray-500"
                    } hover:text-blue-600`}
                  >
                    👍 <span className="ml-1">{discussion.likedBy?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(discussion.id)}
                    className={`flex items-center ${
                      discussion.dislikedBy?.some((dislike) => dislike.uid === user?.uid)
                        ? "text-red-500"
                        : "text-gray-500"
                    } hover:text-red-600`}
                  >
                    👎 <span className="ml-1">{discussion.dislikedBy?.length || 0}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No discussions available for this property.</p>
          )}
        </div>
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
    </Layout>
  );
}
