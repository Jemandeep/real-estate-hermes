"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import Layout from "@/app/components/Layout";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaThumbsUp } from "react-icons/fa";

const PollsList = () => {
  const router = useRouter();
  const auth = getAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Check authentication
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      router.push("/login");
    }
  }, [auth, router]);

  // Fetch polls in real-time
  useEffect(() => {
    const pollsRef = collection(db, "polls");
    const unsubscribe = onSnapshot(
      pollsRef,
      (snapshot) => {
        const fetchedPolls = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPolls(fetchedPolls);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching polls:", error);
        setError("Failed to load polls. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle voting
  const handleVote = async (pollId, optionIndex) => {
    try {
      const pollRef = doc(db, "polls", pollId);
      const poll = polls.find((poll) => poll.id === pollId);

      if (poll.options[optionIndex].votes.includes(userEmail)) {
        alert("You have already voted for this option!");
        return;
      }

      const updatedOptions = poll.options.map((option, i) =>
        i === optionIndex ? { ...option, votes: [...option.votes, userEmail] } : option
      );

      await updateDoc(pollRef, { options: updatedOptions });
    } catch (error) {
      console.error("Error voting on poll:", error);
      setError("Failed to submit your vote. Please try again.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <p className="text-xl font-semibold text-gray-600">Loading polls...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <p className="text-xl font-semibold text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Community Polls</h1>
            <button
              onClick={() => router.push("/community/polls/new")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              Create New Poll
            </button>
          </div>

          {/* Polls List */}
          {polls.length > 0 ? (
            <div className="space-y-6">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce(
                  (acc, option) => acc + option.votes.length,
                  0
                );

                return (
                  <div
                    key={poll.id}
                    className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {poll.question}
                    </h2>

                    <div className="space-y-4">
                      {poll.options.map((option, index) => {
                        const votePercentage =
                          totalVotes > 0
                            ? ((option.votes.length / totalVotes) * 100).toFixed(0)
                            : 0;

                        return (
                          <div key={index} className="flex flex-col gap-2">
                            <button
                              onClick={() => handleVote(poll.id, index)}
                              disabled={option.votes.includes(userEmail)}
                              className={`flex items-center gap-3 px-4 py-2 rounded-md border ${
                                option.votes.includes(userEmail)
                                  ? "bg-blue-50 border-blue-400 text-blue-600 cursor-not-allowed"
                                  : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-blue-50"
                              }`}
                            >
                              <FaThumbsUp className="text-blue-500" />
                              <span className="font-medium">{option.label}</span>
                            </button>

                            <div className="relative w-full h-4 bg-gray-200 rounded-md">
                              <div
                                className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md"
                                style={{ width: `${votePercentage}%` }}
                              ></div>
                            </div>

                            <span className="text-sm font-medium text-gray-600">
                              {votePercentage}% ({option.votes.length} votes)
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-6 text-gray-700 font-medium text-right">
                      Total Votes: {totalVotes}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-10">No polls available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PollsList;
