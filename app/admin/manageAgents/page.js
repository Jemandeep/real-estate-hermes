"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Link from "next/link";
import Layout from "@/app/components/Layout";

const ManageAgents = () => {
  const [pendingAgents, setPendingAgents] = useState([]); // Store pending agent requests
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchPendingAgents = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedPendingAgents = querySnapshot.docs
          .filter(doc => doc.data().role === "pending_agent")
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        setPendingAgents(fetchedPendingAgents);
      } catch (err) {
        setError("Failed to fetch pending agents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAgents();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: "agent" });
      setPendingAgents(pendingAgents.filter(agent => agent.id !== userId));
      alert("Agent approved successfully!");
    } catch (err) {
      setError("Failed to approve agent");
      console.error(err);
    }
  };

  const handleReject = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to reject this agent request?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setPendingAgents(pendingAgents.filter(agent => agent.id !== userId));
        alert("Agent request rejected and deleted.");
      } catch (err) {
        setError("Failed to reject agent request");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Agents</h1>

        {pendingAgents.length === 0 ? (
          <p>No pending agent requests at the moment.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">License Number</th>
                  <th className="text-left py-2 px-4">Agency Name</th>
                  <th className="text-left py-2 px-4">Phone Number</th>
                  <th className="text-left py-2 px-4">LinkedIn</th>
                  <th className="text-left py-2 px-4">Certification URL</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAgents.map(agent => (
                  <tr key={agent.id} className="border-t">
                    <td className="py-2 px-4">{agent.name || "N/A"}</td>
                    <td className="py-2 px-4">{agent.email || "N/A"}</td>
                    <td className="py-2 px-4">{agent.licenseNumber || "N/A"}</td>
                    <td className="py-2 px-4">{agent.agencyName || "N/A"}</td>
                    <td className="py-2 px-4">{agent.phoneNumber || "N/A"}</td>
                    <td className="py-2 px-4">
                      {agent.linkedIn ? (
                        <a href={agent.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View
                        </a>
                      ) : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {agent.certificationURL ? (
                        <a href={agent.certificationURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Document
                        </a>
                      ) : "N/A"}
                    </td>
                    <td className="py-2 px-4 flex space-x-2">
                      <button
                        onClick={() => handleApprove(agent.id)}
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(agent.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link href="/admin">
          <span className="text-blue-600 hover:underline cursor-pointer mt-4 block">Back to Admin Dashboard</span>
        </Link>
      </div>
    </Layout>
  );
};

export default ManageAgents;
