"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import Layout from "../../components/Layout";

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const snapshot = await getDocs(collection(db, "listings"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      await deleteDoc(doc(db, "listings", id));
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Listings</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="border p-4 rounded mb-2">
              <p>{listing.address}</p>
              <button
                onClick={() => handleDelete(listing.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ManageListings;
