"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

const NewPoll = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ label: "", votes: [] }]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Check authentication and fetch user role
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserRole(userData.role);
          setUserEmail(user.email);

          if (userData.role !== "user") {
            fetchSuggestions(); // Fetch suggestions if the user is an agent
          }
        } else {
          console.error("User not found in Firestore.");
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch suggestions for agent users
  const fetchSuggestions = async () => {
    try {
      const suggestionsRef = collection(db, 'suggestions');
      const suggestionsSnapshot = await getDocs(suggestionsRef);
      const fetchedSuggestions = suggestionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(fetchedSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Handle selecting a suggestion to prefill the poll form
  const handleSelectSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setQuestion(suggestion.question);
    setOptions(suggestion.options.map(option => ({ label: option.label, votes: [] })));
  };

  // Handle each option's text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].label = value;
    setOptions(newOptions);
  };

  // Add a new option field
  const addOption = () => {
    setOptions([...options, { label: "", votes: [] }]);
  };

  // Remove an option field
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Handle form submission to create a poll
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.some(option => !option.label)) {
      setError("Please fill in the question and all options.");
      return;
    }

    try {
      await addDoc(collection(db, 'polls'), {
        question,
        options,
        createdBy: selectedSuggestion ? selectedSuggestion.createdBy : userEmail,
        approvedBy: userEmail, // Adds the agent's email as the approver
        createdAt: serverTimestamp(),
      });
      router.push("/community/polls");
    } catch (err) {
      console.error("Error creating poll:", err);
      setError("Failed to create poll. Please try again.");
    }
  };

  // Display message if user role is not allowed to create polls
  if (userRole === "user") {
    return (
      <Layout>
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Poll Creation</h1>
          <p className="text-gray-600">
            As a regular user, you cannot create polls. You may submit a suggestion instead.
          </p>
          <button
            onClick={() => router.push('/community/polls/suggestions')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Suggestions
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="w-2/3 pr-4">
          <h1 className="text-2xl font-bold mb-4">Create a New Poll</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block font-semibold mb-2">Poll Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter your poll question"
            />

            <label className="block font-semibold mb-2">Poll Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addOption}
              className="w-full bg-blue-500 text-white p-2 rounded mb-4"
            >
              Add Option
            </button>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Submit Poll
            </button>
          </form>
        </div>

        {/* Suggestions Section */}
        <div className="w-1/3 pl-4">
          <h2 className="text-xl font-semibold mb-2">Suggestions</h2>
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-scroll">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="p-2 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200"
                >
                  <p className="font-semibold">{suggestion.question}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No suggestions available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewPoll;
