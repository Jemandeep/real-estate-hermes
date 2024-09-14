"use client";

import React, { useEffect } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {

  useEffect(() => {
    const handleResize = () => {
      const chart = document.getElementById('chart'); // You can adjust this to match your specific element
      if (chart) {
        chart.style.width = window.innerWidth * 0.8 + 'px'; // Adjust chart width
        chart.style.height = window.innerHeight * 0.5 + 'px'; // Adjust chart height
      }
    };

    // Call the resize function initially when the component mounts
    handleResize();

    // Add the event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <NavBar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
