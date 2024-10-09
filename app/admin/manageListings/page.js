"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure the correct path to your firebase.js
import Link from "next/link";
import Layout from "@/app/components/Layout";

const ManageListings = () => {
  const [listings, setListings] = useState([]); // State to store active listings
  const [deletedListings, setDeletedListings] = useState([]); // State to store deleted listings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showDeleted, setShowDeleted] = useState(false); // Toggle for showing deleted listings
  const [selectedListings, setSelectedListings] = useState([]); // State for selected listings
  const [selectMode, setSelectMode] = useState(false); // Toggle for selection mode

  // Fetch listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "listings"));
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Separate active and deleted listings
        const activeListings = fetchedListings.filter(listing => !listing.deleted);
        const deletedListings = fetchedListings.filter(listing => listing.deleted);

        setListings(activeListings);
        setDeletedListings(deletedListings);
      } catch (err) {
        setError("Failed to fetch listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Soft delete a listing (set 'deleted' to true)
  const handleSoftDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      try {
        await updateDoc(doc(db, "listings", id), { deleted: true });
        setListings(listings.filter(listing => listing.id !== id)); // Remove from active listings
        const restoredListing = listings.find(listing => listing.id === id);
        setDeletedListings([...deletedListings, { ...restoredListing, deleted: true }]); // Add to deleted listings
      } catch (err) {
        setError("Failed to delete listing");
        console.error(err);
      }
    }
  };

  // Restore a deleted listing (set 'deleted' to false)
  const handleRestore = async (id) => {
    const confirmed = window.confirm("Are you sure you want to restore this listing?");
    if (confirmed) {
      try {
        await updateDoc(doc(db, "listings", id), { deleted: false });
        setDeletedListings(deletedListings.filter(listing => listing.id !== id)); // Remove from deleted listings
        const restoredListing = deletedListings.find(listing => listing.id === id);
        setListings([...listings, { ...restoredListing, deleted: false }]); // Add back to active listings
      } catch (err) {
        setError("Failed to restore listing");
        console.error(err);
      }
    }
  };

  // Toggle between showing active and deleted listings
  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted);
  };

  // Toggle select/unselect mode
  const toggleSelectMode = () => {
    if (selectMode) {
      setSelectedListings([]); // Clear selected listings when unselecting
    }
    setSelectMode(!selectMode); // Toggle selection mode
  };

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedListings(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(listingId => listingId !== id); // Uncheck the box
      } else {
        return [...prevSelected, id]; // Check the box
      }
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete the selected listings?");
    if (confirmed) {
      try {
        const deletePromises = selectedListings.map(id => updateDoc(doc(db, "listings", id), { deleted: true }));
        await Promise.all(deletePromises);
        setListings(listings.filter(listing => !selectedListings.includes(listing.id))); // Remove from active listings
        setSelectedListings([]); // Clear selected listings
      } catch (err) {
        setError("Failed to delete selected listings");
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
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Listings</h1>

        <div className="flex justify-between mb-4">
          {/* Select/Unselect Mode Toggle Button */}
          <button
            onClick={toggleSelectMode}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {selectMode ? "Unselect" : "Select"}
          </button>

          {/* Button to toggle between active and deleted listings */}
          <button
            onClick={toggleShowDeleted}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            {showDeleted ? "Show Active Listings" : "Show Deleted Listings"}
          </button>
        </div>

        {/* Delete Selected Button (shown only if in select mode) */}
        {selectMode && (
          <button
            onClick={handleBulkDelete}
            className={`bg-red-600 text-white py-2 px-4 rounded mb-4 ${
              selectedListings.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
            disabled={selectedListings.length === 0}
          >
            Delete Selected
          </button>
        )}

        {/* Show active or deleted listings based on toggle */}
        {showDeleted ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Deleted Listings</h2>
            {deletedListings.length === 0 ? (
              <p>No deleted listings available.</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-2 px-4">Address</th>
                    <th className="text-left py-2 px-4">Price</th>
                    <th className="text-left py-2 px-4">Bedrooms</th>
                    <th className="text-left py-2 px-4">Bathrooms</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedListings.map((listing) => (
                    <tr key={listing.id} className="border-t">
                      <td className="py-2 px-4">{listing.address}</td>
                      <td className="py-2 px-4">${listing.current_price.toLocaleString()}</td>
                      <td className="py-2 px-4">{listing.bed_count}</td>
                      <td className="py-2 px-4">{listing.bathroom_count}</td>
                      <td className="py-2 px-4">
                        <span
                          onClick={() => handleRestore(listing.id)}
                          className="text-green-600 hover:underline cursor-pointer"
                        >
                          Restore
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Listings</h2>
            {listings.length === 0 ? (
              <p>No active listings available.</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4">{selectMode && "Select"}</th> {/* Show "Select" if in select mode */}
                    <th className="text-left py-2 px-4">Address</th>
                    <th className="text-left py-2 px-4">Price</th>
                    <th className="text-left py-2 px-4">Bedrooms</th>
                    <th className="text-left py-2 px-4">Bathrooms</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id} className="border-t">
                      <td className="py-2 px-4">
                        {selectMode && (
                          <input
                            type="checkbox"
                            className="w-6 h-6"
                            checked={selectedListings.includes(listing.id)}
                            onChange={() => handleCheckboxChange(listing.id)}
                          />
                        )}
                      </td>
                      <td className="py-2 px-4">{listing.address}</td>
                      <td className="py-2 px-4">${listing.current_price.toLocaleString()}</td>
                      <td className="py-2 px-4">{listing.bed_count}</td>
                      <td className="py-2 px-4">{listing.bathroom_count}</td>
                      <td className="py-2 px-4">
                        <Link href={`/admin/manageListings/edit/${listing.id}`}>
                          <span className="text-blue-600 hover:underline cursor-pointer">Edit</span>
                        </Link>
                        {" | "}
                        <span
                          onClick={() => handleSoftDelete(listing.id)}
                          className="text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <Link href="/admin">
          <span className="text-blue-600 hover:underline cursor-pointer mt-4 block">Back to Admin Dashboard</span>
        </Link>
      </div>
    </Layout>
  );
};

export default ManageListings;
