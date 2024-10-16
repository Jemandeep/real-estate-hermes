"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import Layout from "../components/Layout"; // Ensure the path is correct
import Link from "next/link";

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check if the user is authenticated and has the "admin" role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Fetch user role and ensure they are an admin
        currentUser.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.role === "admin") {
            setUser(currentUser);
          } else {
            router.push("/"); // Redirect to home if not admin
          }
        });
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Listings */}
          <Link href="/admin/manageListings">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Listings</h2>
              <p className="text-gray-600">View, edit, and delete property listings.</p>
            </div>
          </Link>

          {/* Manage Users */}
          <Link href="/admin/manageUsers">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Users</h2>
              <p className="text-gray-600">Manage user roles and access permissions.</p>
            </div>
          </Link>

          {/* Manage Agents */}
          <Link href="/admin/manageAgents">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Agents</h2>
              <p className="text-gray-600">Approve or reject agent applications.</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
