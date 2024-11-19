"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import Layout from '@/app/components/Layout';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FaThumbsUp } from 'react-icons/fa';

const PollsList = () => {
  const router = useRouter();
  const auth = getAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Get the current user's email if logged in, otherwise redirect to login
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
    const fetchPolls = () => {
      const pollsRef = collection(db, 'polls');
      const unsubscribe = onSnapshot(pollsRef, (snapshot) => {
        const fetchedPolls = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPolls(fetchedPolls);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching polls:", error);
        setError("Failed to load polls. Please try again.");
        setLoading(false);
      });

      return () => unsubscribe();
    };
    fetchPolls();
  }, []);

  // Handle voting
  const handleVote = async (pollId, optionIndex) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      const poll = polls.find((poll) => poll.id === pollId);

      // Check if the user has already voted for this option
      if (poll.options[optionIndex].votes.includes(userEmail)) {
        alert("You have already voted for this option!");
        return;
      }

      // Update the options array with the new vote
      const updatedOptions = poll.options.map((option, index) => {
        if (index === optionIndex) {
          return { ...option, votes: [...option.votes, userEmail] };
        }
        return option;
      });

      await updateDoc(pollRef, { options: updatedOptions });
    } catch (error) {
      console.error("Error voting on poll:", error);
      setError("Failed to submit your vote. Please try again.");
    }
  };

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Community Polls</h1>
          <button
            onClick={() => router.push('/community/polls/new')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Create New Poll
          </button>
        </div>

        {polls.length > 0 ? (
          polls.map((poll) => {
            const totalVotes = poll.options.reduce((acc, option) => acc + option.votes.length, 0);
            return (
              <div key={poll.id} className="bg-white rounded-lg p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{poll.question}</h2>

                {poll.options.map((option, index) => {
                  const votePercentage = totalVotes > 0 ? ((option.votes.length / totalVotes) * 100).toFixed(0) : 0;
                  return (
                    <div key={index} className="flex items-center mb-4">
                      <button
                        onClick={() => handleVote(poll.id, index)}
                        className={`flex items-center text-left w-full bg-gray-100 p-2 rounded-lg shadow-sm hover:bg-blue-100 transition-colors duration-150 ${option.votes.includes(userEmail) ? 'bg-blue-100' : ''}`}
                        disabled={option.votes.includes(userEmail)}
                      >
                        <FaThumbsUp className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-800">{option.label}</span>
                      </button>
                      <div className="w-full bg-gray-300 h-4 rounded ml-4 mr-2">
                        <div
                          className="bg-blue-500 h-4 rounded"
                          style={{
                            width: `${votePercentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-700 font-medium">{votePercentage}% ({option.votes.length})</span>
                    </div>
                  );
                })}

                <p className="text-gray-700 mt-4 font-semibold">
                  Total number of votes: {totalVotes}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No polls available.</p>
        )}
      </div>
    </Layout>
  );
};

export default PollsList;
