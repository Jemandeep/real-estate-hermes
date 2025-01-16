"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { FaUserCircle } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const NavBar = ({ setNavHeight = () => {} }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, [setNavHeight]);

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
    <nav
      ref={navRef}
      className="bg-stone-100 shadow-lg py-6 fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center px-8">
        <Link href="/" className="text-2xl font-extrabold text-gray-900">
          Calgary Real Estate
        </Link>

        <div className="flex items-center space-x-6">
          {/* <Link
            href="/analysis"
            className="text-lg text-stone-600 font-semibold hover:text-gray-900"
          >
            Analysis
          </Link> */}
          <Link
            href="/viewListings"
            className="text-lg text-stone-600 font-semibold hover:text-gray-900"
          >
            Listings
          </Link>
          
          <Link
            href="/mortcalculator"
            className="text-lg text-stone-600 font-semibold hover:text-gray-900"
          >
            Calculator
          </Link>
          <Link
            href="/community"
            className="text-lg text-stone-600 font-semibold hover:text-gray-900"
          >
            Community
          </Link>
          <Link
            href="/faq"
            className="text-lg text-stone-600 font-semibold hover:text-gray-900"
          >
            FAQ
          </Link>

          {userRole === "admin" && (
            <Link
              href="/admin"
              className="text-lg text-stone-600 font-semibold hover:text-gray-900"
            >
              Admin
            </Link>
          )}

          {userRole === "agent" && (
            <Link
              href="/ModListings"
              className="text-lg text-stone-600 font-semibold hover:text-gray-900"
            >
              New Listing
            </Link>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <FaUserCircle className="text-3xl text-stone-600" />
                <span className="text-lg text-stone-600 font-semibold">
                  Account
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-56">
                  <Link
                    href="/accounts/info"
                    className="block px-6 py-3 text-lg text-stone-600 hover:bg-stone-200"
                  >
                    Account Info
                  </Link>
                  {/* <Link
                    href="/accounts/saved"
                    className="block px-6 py-3 text-lg text-stone-600 hover:bg-stone-200"
                  >
                    Saved Listings
                  </Link>
                  <Link
                    href="/accounts/settings"
                    className="block px-6 py-3 text-lg text-stone-600 hover:bg-stone-200"
                  >
                    Settings
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-6 py-3 text-lg text-stone-600 hover:bg-stone-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-lg text-stone-600 font-semibold hover:text-gray-900"
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
