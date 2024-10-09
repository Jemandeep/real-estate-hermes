"use client";
import Link from "next/link";
import Layout from "../components/Layout";

const AdminPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Listings Card */}
          <Link href="/admin/manageListings">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Listings</h2>
              <p className="text-gray-600">View, edit, approve, or delete property listings posted by agents.</p>
            </div>
          </Link>

          {/* Manage Users Card */}
          <Link href="/admin/manageUsers">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Users</h2>
              <p className="text-gray-600">View, promote, or block users. Manage roles like admin and agent.</p>
            </div>
          </Link>

          {/* Manage Agents Card */}
          <Link href="/admin/manageAgents">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl cursor-pointer transition duration-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Agents</h2>
              <p className="text-gray-600">Approve or reject agent applications. Manage agent profiles and performance.</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
