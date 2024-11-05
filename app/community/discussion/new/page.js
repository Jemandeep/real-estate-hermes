"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const NewDiscussion = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if a user is logged in, and fetch user details from the `users` collection
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);

        try {
          // Fetch additional user details from `users` collection
          const userDocRef = doc(db, 'users', user.email);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserName(userData.name || "Anonymous");
            setUserRole(userData.role || "user");
          } else {
            console.warn("User data not found in Firestore");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        // If no user is logged in, redirect to login page
        router.push('/login');
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!userId || !userEmail || !userName || !userRole) {
        throw new Error("User information is incomplete.");
      }

      // Create new discussion object with autofilled fields
      const newDiscussion = {
        title,
        content,
        createdAt: serverTimestamp(),
        createdBy: userId,
        createdByEmail: userEmail,
        createdByName: userName,
        createdByRole: userRole,
        commentCount: 0,   // Initial comment count
        likes: 0,          // Initial like count
        dislikedBy: [],    // Empty array for dislikes
        likedBy: []        // Empty array for likes
      };
      
      // Add new discussion to Firestore
      const docRef = await addDoc(collection(db, 'discussions'), newDiscussion);

      // Redirect to the newly created discussion page
      router.push(`/community/discussion/detailed?id=${docRef.id}`);
    } catch (err) {
      console.error("Error creating discussion:", err);
      setError("Failed to create discussion. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Start a New Discussion</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            id="title"
            className="w-full p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter discussion title"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            id="content"
            className="w-full p-3 border rounded-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your discussion content here..."
            rows="6"
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Creating Discussion..." : "Create Discussion"}
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;
