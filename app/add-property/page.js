"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';

const AddProperty = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
    postal_code: '',
    latitude: '',
    longitude: '',
    neighborhood: '',
  });

  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'properties'), {
        ...formValues,
        userEmail: user.email, // Include user email
      });

      alert('Property added successfully!');
      router.push('/analysis'); // Redirect back to analysis
    } catch (error) {
      console.error('Error adding property: ', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-gray-700">Bathrooms</label>
            <input
              type="number"
              name="bathroom_count"
              value={formValues.bathroom_count}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Bedrooms</label>
            <input
              type="number"
              name="bed_count"
              value={formValues.bed_count}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Current Price</label>
            <input
              type="number"
              name="current_price"
              value={formValues.current_price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Property
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProperty;
