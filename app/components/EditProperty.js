// components/EditProperty.js
"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; 
import Layout from '../components/Layout';
import SelfCompleteButton from '../components/SelfComplete'; // Adjust path if necessary

const EditProperty = ({ propertyId }) => {
  const [formValues, setFormValues] = useState({
    address: '',
    neighborhood: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    bathroom_count: '', 
    bed_count: '',      
    current_price: '',
    past_6_months_prices: '',
    past_5_year_price: '',
    past_10_year_price: '',
    past_15_year_price: '',
    is_for_rent: false,
    rent_price: '',
    mortgage_monthly_payment: '',
    mortgage_amount: '',
    mortgage_interest_rate: '',
    loan_term_years: '',
    equity: '',
    down_payment: '',
    maintenance: '',
    taxes: '',
    insurance: '',
  });

  const router = useRouter(); 
  const auth = getAuth();
  const [user, setUser] = useState(null);

  // Fetch user authentication status
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

  // Fetch property data if editing
  useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        const docRef = doc(db, 'properties', propertyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormValues(docSnap.data());
        }
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormValues({ ...formValues, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = doc(db, 'properties', propertyId);
      await updateDoc(docRef, formValues);
      alert('Property updated successfully!');
      router.push('/analysis');
    } catch (error) {
      console.error('Error updating property: ', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Neighborhood</label>
              <input
                type="text"
                name="neighborhood"
                value={formValues.neighborhood}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formValues.postal_code}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formValues.latitude}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formValues.longitude}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Bathrooms</label>
              <input
                type="number"
                name="bathroom_count"
                value={formValues.bathroom_count}
                onChange={handleChange}
                required
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
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Current Market Price Field */}
          <div>
            <label className="block text-gray-700">Current Market Price</label>
            <input
              type="number"
              name="current_price"
              value={formValues.current_price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Self Complete Button */}
          <SelfCompleteButton formValues={formValues} setFormValues={setFormValues} />

          {/* Past Price Data */}
          <div>
            <label className="block text-gray-700 mb-2">Price for the Past 6 Months</label>
            <input
              type="number"
              name="past_6_months_prices"
              value={formValues.past_6_months_prices}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter price for the past 6 months"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price 5 Years Ago</label>
            <input
              type="number"
              name="past_5_year_price"
              value={formValues.past_5_year_price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price 10 Years Ago</label>
            <input
              type="number"
              name="past_10_year_price"
              value={formValues.past_10_year_price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price 15 Years Ago</label>
            <input
              type="number"
              name="past_15_year_price"
              value={formValues.past_15_year_price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Rent Section */}
          <div>
            <label className="block text-gray-700">Is Property for Rent?</label>
            <input
              type="checkbox"
              name="is_for_rent"
              checked={formValues.is_for_rent}
              onChange={handleChange}
            />
          </div>

          {formValues.is_for_rent && (
            <div>
              <label className="block text-gray-700">Rent Price</label>
              <input
                type="number"
                name="rent_price"
                value={formValues.rent_price}
                onChange={handleChange}
                required={formValues.is_for_rent}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {/* Mortgage Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Mortgage Monthly Payment</label>
              <input
                type="number"
                name="mortgage_monthly_payment"
                value={formValues.mortgage_monthly_payment}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Mortgage Amount</label>
              <input
                type="number"
                name="mortgage_amount"
                value={formValues.mortgage_amount}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Mortgage Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                name="mortgage_interest_rate"
                value={formValues.mortgage_interest_rate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Loan Term (Years)</label>
              <input
                type="number"
                name="loan_term_years"
                value={formValues.loan_term_years}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Equity</label>
              <input
                type="number"
                name="equity"
                value={formValues.equity}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Down Payment</label>
              <input
                type="number"
                name="down_payment"
                value={formValues.down_payment}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Other Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Maintenance</label>
              <input
                type="number"
                name="maintenance"
                value={formValues.maintenance}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Taxes</label>
              <input
                type="number"
                name="taxes"
                value={formValues.taxes}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Insurance</label>
              <input
                type="number"
                name="insurance"
                value={formValues.insurance}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Update Property
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProperty;
