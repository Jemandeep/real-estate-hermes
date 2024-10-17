"use client";
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase'; // Ensure the correct path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import Layout from '../../components/Layout';

const AccountInfo = () => {
  const [user, setUser] = useState(null); // Track authenticated user
  const [userInfo, setUserInfo] = useState(null); // Store user/agent data
  const [isEditMode, setIsEditMode] = useState(false); // Toggle edit mode
  const [loading, setLoading] = useState(true); // Track loading state
  const [formValues, setFormValues] = useState({}); // Store input values
  const [newPassword, setNewPassword] = useState(''); // New password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password input

  useEffect(() => {
    // Track authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserInfo(currentUser.email);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const fetchUserInfo = async (email) => {
    try {
      const userRef = doc(db, 'users', email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserInfo(data);
        setFormValues(data); // Initialize form with data
      } else {
        console.error('User data not found.');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  const handleSaveChanges = async () => {
    try {
      const userRef = doc(db, 'users', user.email);
      await updateDoc(userRef, formValues);
      alert('Changes saved successfully!');
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await updatePassword(user, newPassword);
      alert('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading account information...</p>;
  if (!userInfo) return <p className="text-center mt-10">No account information found.</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Account Information</h1>

        <div className="bg-white shadow-md rounded p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formValues.name || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded ${isEditMode ? '' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formValues.email || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded ${isEditMode ? '' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formValues.phoneNumber || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded ${isEditMode ? '' : 'bg-gray-100'}`}
              />
            </div>

            {userInfo.role === 'agent' && (
              <>
                <div>
                  <label className="block text-sm font-semibold">Agency Name</label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formValues.agencyName || ''}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    className={`w-full p-2 border rounded ${isEditMode ? '' : 'bg-gray-100'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formValues.licenseNumber || ''}
                    disabled // License number is not editable
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formValues.role || ''}
                    disabled // Role is not editable
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              </>
            )}
          </div>

          {isEditMode && (
            <div className="mt-6">
              <label className="block text-sm font-semibold">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />

              <label className="block text-sm font-semibold">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />

              <button
                onClick={handlePasswordUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Update Password
              </button>
            </div>
          )}

          <div className="mt-6">
            {isEditMode ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                >
                  Save Changes
                </button>
                <button
                  onClick={toggleEditMode}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={toggleEditMode}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Information
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountInfo;
