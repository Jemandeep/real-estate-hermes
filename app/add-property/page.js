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
    neighborhood: '',
    postal_code: '',
    bathroom_count: 1,
    bed_count: 1,
    property_type: '',
    purchased_price: '',
    current_price: '',
    past_6_months_prices: Array(6).fill(''),
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
    latitude: '',  // New latitude field
    longitude: '', // New longitude field
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

  // Set up Google Places Autocomplete for address input
  useEffect(() => {
    const loadAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('address-input'),
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const { lat, lng } = place.geometry.location;
        const postalCodeComponent = place.address_components.find((component) =>
          component.types.includes('postal_code')
        );
        const neighborhoodComponent = place.address_components.find((component) =>
          component.types.includes('neighborhood') || component.types.includes('sublocality')
        );

        setFormValues((prev) => ({
          ...prev,
          address: place.formatted_address,
          postal_code: postalCodeComponent ? postalCodeComponent.short_name : '',
          latitude: lat(),
          longitude: lng(),
          neighborhood: neighborhoodComponent ? neighborhoodComponent.long_name : '',
        }));
      });
    };

    if (window.google && window.google.maps) {
      loadAutocomplete();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAkhw-ajGfapfGKUYblHstW85TIm-IjKSU&libraries=places`;
      script.onload = () => loadAutocomplete();
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues({ ...formValues, [name]: checked });
    } else if (name.startsWith('past_6_months_prices')) {
      const index = parseInt(name.split('_')[3]);
      const updatedPrices = [...formValues.past_6_months_prices];
      updatedPrices[index] = value;
      setFormValues({ ...formValues, past_6_months_prices: updatedPrices });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Save the property to the "properties" collection in Firestore with user email
      await addDoc(collection(db, 'properties'), {
        ...formValues,
        userEmail: user.email, // Include user email with the property
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
          {/* Address Section with Autocomplete */}
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              id="address-input"
              value={formValues.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Start typing an address..."
            />
          </div>

          <div>
            <label className="block text-gray-700">Neighborhood</label>
            <input
              type="text"
              name="neighborhood"
              value={formValues.neighborhood}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter neighborhood"
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
              placeholder="Enter postal code"
            />
          </div>

          {/* Lat/Long Fields */}
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

          {/* Room and Price Info */}
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

          <div>
            <label className="block text-gray-700">Property Type</label>
            <input
              type="text"
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Purchased Price</label>
            <input
              type="number"
              name="purchased_price"
              value={formValues.purchased_price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

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

          {/* Past Price Data */}
          <div>
            <label className="block text-gray-700">Price for the Past 6 Months</label>
            {formValues.past_6_months_prices.map((price, index) => (
              <input
                key={index}
                type="number"
                name={`past_6_months_prices_${index}`}
                value={price}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded mb-2"
                placeholder={`Month ${index + 1} Price`}
              />
            ))}
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

          {/* Other Expenses */}
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

          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Property
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProperty;
