"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';

const Suggestions = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ label: "" }]);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch authenticated user email
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle each option's text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].label = value;
    setOptions(newOptions);
  };

  // Add a new option field
  const addOption = () => {
    setOptions([...options, { label: "" }]);
  };

  // Remove an option field
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.some(option => !option.label)) {
      setError("Please fill in the question and all options.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'suggestions'), {
        question,
        options,
        createdBy: userEmail,
        createdAt: serverTimestamp(),
        status: "pending",
      });
      setSuccess(true); // Show success animation
      setTimeout(() => router.push("/community/polls"), 1500); // Redirect after 1.5 seconds
    } catch (err) {
      console.error("Error creating suggestion:", err);
      setError("Failed to submit suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md relative">
        <h1 className="text-2xl font-bold mb-4">Submit a Suggestion</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Success Checkmark Animation */}
        {success && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="text-green-500 text-6xl animate-ping">✓</div>
          </div>
        )}

        {!loading && !success && (
          <form onSubmit={handleSubmit}>
            <label className="block font-semibold mb-2">Suggestion Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter your suggestion question"
            />

            <label className="block font-semibold mb-2">Options</label>
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
              Submit Suggestion
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Suggestions;
