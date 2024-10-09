"use client";
import Link from "next/link";
import Layout from "../components/Layout";

const AdminPage = () => {
  return (
    <Layout>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <ul className="space-y-4">
        <li>
          <Link href="/admin/manageListings">
            <span className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
              Manage Listings
            </span>
          </Link>
        </li>
        <li>
          <Link href="/admin/manageUsers">
            <span className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
              Manage Users
            </span>
          </Link>
        </li>
        <li>
          <Link href="/admin/manageAgents">
            <span className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
              Manage Agents
            </span>
          </Link>
        </li>
        
      </ul>
    </div>
    </Layout>
  );
};


export default AdminPage;
