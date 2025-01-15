import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore methods for fetching user data
import { auth, db } from "../../firebase"; // Ensure the path to your Firebase config is correct

const Header = () => {
  const [userName, setUserName] = useState(null); // State to track user's name

  // Function to capitalize the first letter of the name
  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Wrap fetchUserName in useCallback to avoid re-creating it on every render
  const fetchUserName = useCallback(
    async (email) => {
      try {
        // Fetch the user's document from Firestore using their email as the document ID
        const userDoc = await getDoc(doc(db, "users", email));
        
        if (userDoc.exists()) {
          // Get the full name from Firestore
          const fullName = userDoc.data().name || "";
          const firstName = fullName.split(" ")[0]; // Get the first name
          setUserName(capitalizeFirstLetter(firstName));
        } else {
          // If no document exists, fall back to using the email prefix as the name
          const fallbackName = email.split("@")[0];
          setUserName(capitalizeFirstLetter(fallbackName));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [] // no dependencies, so this function won't be redefined on each render
  );

  // Monitor the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user's name from Firestore if logged in
        fetchUserName(user.email);
      } else {
        // If no user is logged in, clear the state
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, [fetchUserName]);

  return (
    <div
      className="bg-stone-500 text-white px-40 py-40 text-center"
      style={{
        backgroundImage: "url('/images/logo4.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-4xl font-bold mb-4 ">
        {userName ? `Welcome, ${userName}` : "Discover Your Dream Home"}
      </h1>
      <p className="text-lg mb-6"></p>
      
      {/* Action Buttons */}
      <div className="space-x-4">
        <a
          href="/viewListings"
          className="bg-white text-stone-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100"
        >
          Browse Listings
        </a>
      </div>
    </div>
  );
};

export default Header;
