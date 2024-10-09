"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure correct path to your firebase config
import Link from "next/link";

const ManageAgents = () => {
  const [pendingAgents, setPendingAgents] = useState([]); // State to store pending agent requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch pending agent requests from Firestore
  useEffect(() => {
    const fetchPendingAgents = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedPendingAgents = querySnapshot.docs
          .filter(doc => doc.data().role === "pending_agent") // Filter only users with pending_agent role
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

  // Handle agent approval
  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: "agent" });
      setPendingAgents(pendingAgents.filter(agent => agent.id !== userId)); // Remove from local state
      alert("Agent approved successfully!");
    } catch (err) {
      setError("Failed to approve agent");
      console.error(err);
    }
  };

  // Handle agent rejection
  const handleReject = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to reject this agent request?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "users", userId)); // Remove the user request completely or update it
        setPendingAgents(pendingAgents.filter(agent => agent.id !== userId)); // Remove from local state
        alert("Agent request rejected and deleted.");
      } catch (err) {
        setError("Failed to reject agent request");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Agents</h1>

      {pendingAgents.length === 0 ? (
        <p>No pending agent requests at the moment.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Email</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingAgents.map(agent => (
              <tr key={agent.id} className="border-t">
                <td className="py-2 px-4">{agent.name || "N/A"}</td>
                <td className="py-2 px-4">{agent.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleApprove(agent.id)}
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(agent.id)}
                    className="bg-red-500 text-white py-1 px-3 ml-4 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/admin">
        <span className="text-blue-600 hover:underline cursor-pointer mt-4 block">Back to Admin Dashboard</span>
      </Link>
    </div>
  );
};

export default ManageAgents;
