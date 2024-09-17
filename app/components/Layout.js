"use client";

import React, { useEffect } from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
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
