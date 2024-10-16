"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure correct path
import Link from "next/link";
import Layout from "@/app/components/Layout";

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [deletedListings, setDeletedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedListings, setSelectedListings] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  // Fetch listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "listings"));
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const activeListings = fetchedListings.filter((listing) => !listing.deleted);
        const deletedListings = fetchedListings.filter((listing) => listing.deleted);

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

  const handleSoftDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      try {
        await updateDoc(doc(db, "listings", id), { deleted: true });
        setListings(listings.filter((listing) => listing.id !== id));
        const deletedListing = listings.find((listing) => listing.id === id);
        setDeletedListings([...deletedListings, { ...deletedListing, deleted: true }]);
      } catch (err) {
        setError("Failed to delete listing");
        console.error(err);
      }
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm("Are you sure you want to restore this listing?");
    if (confirmed) {
      try {
        await updateDoc(doc(db, "listings", id), { deleted: false });
        setDeletedListings(deletedListings.filter((listing) => listing.id !== id));
        const restoredListing = deletedListings.find((listing) => listing.id === id);
        setListings([...listings, { ...restoredListing, deleted: false }]);
      } catch (err) {
        setError("Failed to restore listing");
        console.error(err);
      }
    }
  };

  const toggleShowDeleted = () => setShowDeleted((prev) => !prev);
  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedListings([]); // Clear selected listings when toggling
  };

  const handleCheckboxChange = (id) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete the selected listings?");
    if (confirmed) {
      try {
        await Promise.all(
          selectedListings.map((id) => updateDoc(doc(db, "listings", id), { deleted: true }))
        );
        setListings(listings.filter((listing) => !selectedListings.includes(listing.id)));
        setSelectedListings([]);
      } catch (err) {
        setError("Failed to delete selected listings");
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Listings</h1>

        <div className="flex justify-between mb-4">
          <button
            onClick={toggleSelectMode}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {selectMode ? "Unselect" : "Select"}
          </button>
          <button
            onClick={toggleShowDeleted}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            {showDeleted ? "Show Active Listings" : "Show Deleted Listings"}
          </button>
        </div>

        {selectMode && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white py-2 px-4 rounded mb-4 hover:bg-red-700"
          >
            Delete Selected
          </button>
        )}

        {showDeleted ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Deleted Listings</h2>
            {deletedListings.length === 0 ? (
              <p>No deleted listings available.</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4">Address</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedListings.map((listing) => (
                    <tr key={listing.id} className="border-t">
                      <td className="py-2 px-4">{listing.address}</td>
                      <td className="py-2 px-4">${listing.current_price.toLocaleString()}</td>
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
                    <th className="py-2 px-4">Select</th>
                    <th className="py-2 px-4">Address</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id} className="border-t">
                      <td className="py-2 px-4">
                        {selectMode && (
                          <input
                            type="checkbox"
                            checked={selectedListings.includes(listing.id)}
                            onChange={() => handleCheckboxChange(listing.id)}
                          />
                        )}
                      </td>
                      <td className="py-2 px-4">{listing.address}</td>
                      <td className="py-2 px-4">${listing.current_price.toLocaleString()}</td>
                      <td className="py-2 px-4">
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
      </div>
    </Layout>
  );
};

export default ManageListings;
