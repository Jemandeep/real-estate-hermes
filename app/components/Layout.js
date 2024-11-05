"use client";

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [loading, setLoading] = useState(true); // Track loading state for authentication check
  const router = useRouter(); // Get the router instance for redirection
  const auth = getAuth(); // Initialize Firebase Auth

  useEffect(() => {
    // Define routes that shouldn't trigger a redirect for unauthenticated users
    const publicRoutes = ['/login', '/signup'];

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser); // Set user if logged in
      } else if (!publicRoutes.includes(router.pathname)) {
         // Redirect to login if no user is logged in and not on public routes
      }
      setLoading(false); // Set loading to false once the check is complete
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [auth, router]);

  useEffect(() => {
    // Responsive chart resize functionality, applied only if chart exists on the page
    const chart = document.getElementById('chart');
    if (chart) {
      const handleResize = () => {
        chart.style.width = window.innerWidth * 0.8 + 'px';
        chart.style.height = window.innerHeight * 0.5 + 'px';
      };

      // Initial call and resize listener
      handleResize();
      window.addEventListener('resize', handleResize);

      // Cleanup listener on unmount
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner during auth check
  }

  return (
    <div>
      {/* Fixed NavBar at the top */}
      <NavBar />
      {/* Ensure the padding at the top accommodates the height of the NavBar */}
      <main className="container mx-auto p-4 pt-20">{children}</main>
    </div>
  );
};

export default Layout;
