"use client"; // Ensure the component is client-side
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Updated import for Next.js 13+
import Layout from '../components/Layout'; // Import the Layout component

const ModifyListings = () => {
  const [formValues, setFormValues] = useState({
    address: '',
    bathroom_count: 1,
    bed_count: 1,
    current_price: 50000,
    property_type: '', // Property type field
    postal_code: '',
    latitude: '',
    longitude: '',
    neighborhood: ''
  });

  const [historicalPrices, setHistoricalPrices] = useState([{ month: 'Last month', price: 50000 }]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false); // Track if Google Maps is loaded
  const [user, setUser] = useState(null); // Track the signed-in user
  const [redirectMessage, setRedirectMessage] = useState(false); // Track if redirect message is shown
  const router = useRouter(); // Next.js navigation router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if signed in
      } else {
        setRedirectMessage(true);
        setTimeout(() => {
          router.push('/login'); // Redirect to login after delay
        }, 3000); // 3-second delay before redirection
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load Google Maps script dynamically
  const loadGoogleMapsScript = (callback) => {
    const existingScript = document.getElementById('googleMaps');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = https://maps.googleapis.com/maps/api/js?key=AIzaSyAkhw-ajGfapfGKUYblHstW85TIm-IjKSU&libraries=places;
      script.id = 'googleMaps';
      document.body.appendChild(script);
      script.onload = () => {
        setIsGoogleLoaded(true); // Set state to true when Google Maps script is loaded
        if (callback) callback();
      };
    } else {
      setIsGoogleLoaded(true); // If script is already loaded, set the state to true
      if (callback) callback();
    }
  };

  // Initialize Google autocomplete
  const initAutocomplete = () => {
    if (window.google && window.google.maps) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('address-input'),
        { types: ['geocode'] }
      );

      // When the user selects an address, get the coordinates
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const { lat, lng } = place.geometry.location;

        // Extract postal code
        const postalCodeComponent = place.address_components.find(component => component.types.includes('postal_code'));
        const postalCode = postalCodeComponent ? postalCodeComponent.short_name : '';

        // Extract neighborhood or community
        const neighborhoodComponent = place.address_components.find(component => component.types.includes('neighborhood') || component.types.includes('sublocality'));
        const neighborhood = neighborhoodComponent ? neighborhoodComponent.long_name : '';

        // Update form values with postal code, coordinates, and neighborhood
        setFormValues((prevValues) => ({
          ...prevValues,
          address: place.formatted_address,
          postal_code: postalCode,
          latitude: lat(),
          longitude: lng(),
          neighborhood: neighborhood // Add neighborhood to form values
        }));
      });
    } else {
      console.error("Google Maps is not loaded yet.");
    }
  };

  // UseEffect to load the Google Maps script and initialize autocomplete
  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (isGoogleLoaded) {
        initAutocomplete();
      }
    });
  }, [isGoogleLoaded]); // Depend on the state to ensure the script is loaded

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatPrice = (price) => {
    return price.replace(/,/g, '');
  };

  // Handle changes in the current price input
  const handlePriceChange = (e) => {
    const priceValue = unformatPrice(e.target.value);
    setFormValues((prevValues) => ({
      ...prevValues,
      current_price: priceValue
    }));
  };

  // Add a new historical price entry
  const handleAddPrice = () => {
    const lastPriceCount = historicalPrices.length;
    const nextMonth = Last ${lastPriceCount + 1} month;

    // Append a new price entry to the historical prices array
    setHistoricalPrices((prevPrices) => [
      ...prevPrices,
      { month: nextMonth, price: formValues.current_price }
    ]);
  };

  // Handle updates to a specific historical price
  const handleHistoricalChange = (index, e) => {
    const { value } = e.target;
    const updatedPrices = historicalPrices.map((price, i) =>
      i === index ? { ...price, price: unformatPrice(value) } : price
    );
    setHistoricalPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to add this new listing?');
    if (!confirmed) return;

    try {
      // Add a new listing document with an auto-generated ID
      const docRef = await addDoc(collection(db, 'listings'), {
        ...formValues, // Spread all form values
        prices: historicalPrices // Include historical prices
      });

      alert(Listing added successfully with ID: ${docRef.id});
    } catch (error) {
      console.error('Error adding new listing: ', error);
      alert(Error adding listing: ${error.message});
    }
  };

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Input */}
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              id="address-input"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Property Type Input */}
          <div>
            <label className="block text-gray-700">Property Type</label>
            <input
              type="text"
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter property type"
            />
          </div>

          {/* Current Price Input */}
          <div>
            <label className="block text-gray-700">Current Price</label>
            <div className="flex items-center">
              <input
                type="text"
                name="current_price"
                value={formatPrice(formValues.current_price)}
                onChange={handlePriceChange}
                className="w-1/3 p-2 border rounded mr-4"
              />
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={formValues.current_price}
                onChange={handlePriceChange}
                className="w-2/3"
              />
            </div>
          </div>

          {/* Postal Code (Auto-filled by Geocoding API) */}
          <div>
            <label className="block text-gray-700">Postal Code (Auto-filled)</label>
            <input
              type="text"
              name="postal_code"
              value={formValues.postal_code}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          {/* Latitude (Auto-filled by Geocoding API) */}
          <div>
            <label className="block text-gray-700">Latitude (Auto-filled)</label>
            <input
              type="text"
              name="latitude"
              value={formValues.latitude}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          {/* Longitude (Auto-filled by Geocoding API) */}
          <div>
            <label className="block text-gray-700">Longitude (Auto-filled)</label>
            <input
              type="text"
              name="longitude"
              value={formValues.longitude}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          {/* Neighborhood/Community (Auto-filled by Geocoding API) */}
          <div>
            <label className="block text-gray-700">Neighborhood/Community (Auto-filled)</label>
            <input
              type="text"
              name="neighborhood"
              value={formValues.neighborhood}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          {/* Historical Prices */}
          <h3 className="text-xl font-semibold">Historical Prices</h3>
          {historicalPrices.map((price, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-gray-700">{price.month}</label>
              <input
                type="text"
                value={formatPrice(price.price)}
                onChange={(e) => handleHistoricalChange(index, e)}
                placeholder="Price"
                className="w-full p-2 border rounded"
              />
            </div>
          ))}

          {/* Add Historical Price Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddPrice}
              className="block px-4 py-2 bg-stone-300 text-stone-600 rounded mb-4 hover:bg-gray-100"
            >
              + Add Previous Month Price
            </button>

            <button type="submit" className="block px-4 py-2 bg-stone-300 text-stone-600 rounded hover:bg-gray-100">
              Add New Listing
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};