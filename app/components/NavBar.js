import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase"; // Ensure the path to your Firebase config is correct
import { doc, getDoc } from "firebase/firestore"; // For fetching user role

const NavBar = () => {
  const [user, setUser] = useState(null); // State to track logged-in user
  const [userRole, setUserRole] = useState(""); // State to track the user's role

  // Monitor the user's authentication state and fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Set user to the logged-in user
        // Fetch the user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.email));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // Set the user's role (admin, agent, etc.)
        }
      } else {
        setUser(null); // No user is logged in
        setUserRole(""); // Clear the role
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Handle logout with confirmation
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        await signOut(auth); // Log the user out
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>

        <div className="flex space-x-4">
          {/* Links for Analysis Dashboard and Mortgage Calculator */}
          <Link href="/analysis" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
            Analysis Dashboard
          </Link>

          <Link href="/viewListings" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
            Recent Listings
          </Link>
          <Link href="/advice" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
            Advice
          </Link>

          {/* Conditionally render Admin tab if admin, New Listings tab if agent */}
          {userRole === "admin" ? (
            <Link href="/admin" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
              Admin
            </Link>
          ) : userRole === "agent" ? (
            <Link href="/ModListings" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
              New Listing
            </Link>
          ) : (
            <Link href="/agent" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
              Agent
            </Link>
          )}

          <Link href="/mortcalculator" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
            Mortgage Calculator
          </Link>

          {/* If user is logged in, show Logout button, else show Login button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
