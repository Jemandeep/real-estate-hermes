import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase"; 
import { FaUserCircle } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; 

const NavBar = () => {
  const [user, setUser] = useState(null); 
  const [userRole, setUserRole] = useState(""); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null); 
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-md py-2 fixed top-0 left-0 right-0 z-50 mb-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>

        <div className="flex items-center space-x-3 overflow-x-auto">
          {/* Common Links with decreased text size */}
          <Link href="/analysis" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Analysis
          </Link>
          <Link href="/viewListings" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Listings
          </Link>
          <Link href="/advice" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Advice
          </Link>
          <Link href="/mortcalculator" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Calculator
          </Link>
          <Link href="/rent" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Rent
          </Link>
          <Link href="/bookappointment" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Book Appointment
          </Link>
          <Link href="/investment/page1" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
            Investment
          </Link>

          {userRole === "admin" && (
            <Link href="/admin" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
              Admin
            </Link>
          )}

          {userRole === "agent" && (
            <Link href="/ModListings" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
              New Listing
            </Link>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center space-x-1 focus:outline-none">
                <FaUserCircle className="text-xl text-stone-600" />
                <span className="text-sm">Account</span> {/* Decreased text size */}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg w-48">
                  <Link href="/accounts/info" className="block px-4 py-2 text-sm hover:bg-gray-100">Account Info</Link>
                  <Link href="/accounts/saved" className="block px-4 py-2 text-sm hover:bg-gray-100">Saved Listings</Link>
                  <Link href="/accounts/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          )}

          {!user && (
            <Link href="/login" className="bg-stone-300 text-stone-600 font-semibold px-2 py-1 text-sm rounded-md hover:bg-gray-100">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
