"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navHeight, setNavHeight] = useState(0); // Track navbar height
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"];

    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
      } else if (!publicRoutes.includes(router.pathname)) {
        router.push("/login"); // Redirect unauthenticated users to login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#001F3F", // Navy background
          color: "#FFFFFF", // White text for contrast
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#0A2647", // Navy background
        color: "#5D7B8D", // White text for contrast
      }}
    >
      <NavBar setNavHeight={setNavHeight} />
      <main
  style={{
    flex: 1,
    padding: '2rem',
    maxWidth: 'clamp(800px, 100%, 3600px)', // Limits width dynamically
    margin: '0 auto',
    width: '100%',
  }}
>
  {children}
</main>



      {/* Optional Footer */}
      <footer style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa' }}>
        <p>© 2024 Your Company</p>
      </footer>

    </div>
  );
};

export default Layout;
