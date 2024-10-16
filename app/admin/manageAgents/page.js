"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Layout from "../../components/Layout";

const ManageAgents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role === "pending_agent");
      setAgents(data);
    };

    fetchAgents();
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "agent" });
    setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== id));
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm("Are you sure you want to reject this agent?");
    if (confirmed) {
      await deleteDoc(doc(db, "users", id));
      setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== id));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Agents</h1>
        {agents.length === 0 ? (
          <p>No pending agents.</p>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="border p-4 rounded mb-2">
              <p>{agent.email}</p>
              <button
                onClick={() => handleApprove(agent.id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(agent.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ManageAgents;
