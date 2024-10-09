"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure the correct path to your firebase.js
import Link from "next/link";
import Layout from "@/app/components/Layout";

const ManageListings = () => {
  const [listings, setListings] = useState([]); // State to store listings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
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
        setListings(fetchedListings);
      } catch (err) {
        setError("Failed to fetch listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Handle single listing deletion
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "listings", id));
        setListings(listings.filter(listing => listing.id !== id)); // Remove from local state
      } catch (err) {
        setError("Failed to delete listing");
        console.error(err);
      }
    }
  };

  // Handle multiple listings deletion
  const handleBulkDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete the selected listings?");
    if (confirmed) {
      try {
        const deletePromises = selectedListings.map(id => deleteDoc(doc(db, "listings", id)));
        await Promise.all(deletePromises);
        setListings(listings.filter(listing => !selectedListings.includes(listing.id))); // Remove deleted listings
        setSelectedListings([]); // Clear selected listings
      } catch (err) {
        setError("Failed to delete selected listings");
        console.error(err);
      }
    }
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

  // Toggle select/unselect mode
  const toggleSelectMode = () => {
    if (selectMode) {
      setSelectedListings([]); // Clear selected listings when unselecting
    }
    setSelectMode(!selectMode); // Toggle selection mode
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

        {listings.length === 0 ? (
          <p>No listings available.</p>
        ) : (
          <>
            {/* Select/Unselect Mode Toggle Button */}
            <button
              onClick={toggleSelectMode}
              className="bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700"
            >
              {selectMode ? "Unselect" : "Select"}
            </button>

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
                          className="w-6 h-6"  // Increased size of checkbox
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
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <Link href="/admin">
          <span className="text-blue-600 hover:underline cursor-pointer mt-4 block">Back to Admin Dashboard</span>
        </Link>
      </div>
    </Layout>
  );
};

export default ManageListings;
