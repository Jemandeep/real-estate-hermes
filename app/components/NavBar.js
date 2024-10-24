import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase"; // Ensure Firebase config is correct
import { FaUserCircle } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; 

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Monitor the user's authentication state and role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.email));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        await signOut(auth);
        alert("Logged out successfully!");
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
//  chat gpt :create a navbar component that displays the  logo, common links, and user account options and use link tags
  return (
    <nav className="bg-white shadow-md py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/analysis"
            className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
          >
            Analysis Dashboard
          </Link>

          <Link
            href="/viewListings"
            className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
          >
            Recent Listings
          </Link>

          <Link
            href="/advice"
            className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
          >
            Advice
          </Link>

          <Link
            href="/mortcalculator"
            className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
          >
            Mortgage Calculator
          </Link>

          {userRole === "admin" && (
            <Link
              href="/admin"
              className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
            >
              Admin
            </Link>
          )}

          {userRole === "agent" && (
            <Link
              href="/ModListings"
              className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
            >
              New Listing
            </Link>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <FaUserCircle className="text-2xl text-stone-600" />
                <span>Account</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48">
                  <Link
                    href="/accounts/info"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Account Info
                  </Link>
                  <Link
                    href="/accounts/saved"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Saved Listings
                  </Link>
                  <Link
                    href="/accounts/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && (
            <Link
              href="/login"
              className="bg-stone-300 text-stone-600 font-bold px-6 py-3 rounded-md hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
