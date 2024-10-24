"use client";

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth
import { useRouter } from 'next/navigation'; // Next.js router for navigation
import NavBar from './NavBar';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const router = useRouter(); // Get the router instance for redirection
  const auth = getAuth(); // Initialize Firebase Auth

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser); // Set user if logged in
      } else {
        // If no user, redirect to login page
        router.push('/login');
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [auth, router]);

  useEffect(() => {
    // Ensure the chart-related functionality is only applied on pages that actually have a chart.
    const chart = document.getElementById('chart');
    if (chart) {
      const handleResize = () => {
        chart.style.width = window.innerWidth * 0.8 + 'px';
        chart.style.height = window.innerHeight * 0.5 + 'px';
      };

      // Initial call when the component mounts
      handleResize();

      // Setup the resize event listener
      window.addEventListener('resize', handleResize);

      // Cleanup the event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (!user) {
    return null; // Optionally, return a loading spinner here while checking auth state
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
