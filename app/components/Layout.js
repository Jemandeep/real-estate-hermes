"use client";

import React from 'react';
import NavBar from './NavBar'; 

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
