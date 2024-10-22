import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase'; // Firebase configuration
import { useRouter } from 'next/navigation'; // For navigation to add property page

const PropertySidebar = () => {
  const [userProperties, setUserProperties] = useState([]);
  const router = useRouter(); // Use Next.js router to navigate

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'properties')); // Fetch from Firestore collection
        const properties = querySnapshot.docs.map((doc) => doc.data()); // Get the data from each document
        setUserProperties(properties); // Set the properties in state
      } catch (error) {
        console.error('Error fetching properties: ', error);
      }
    };

    fetchProperties();
  }, []); // Only fetch when the component mounts

  const handleAddProperty = () => {
    router.push('/add-property'); // Navigate to add property page
  };

  return (
    <div style={{ 
      width: '300px', 
      padding: '20px', 
      backgroundColor: '#f4f4f4', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      overflowY: 'auto',
      maxHeight: '400px'
    }}>
      <h3>Your Properties</h3>
      
      {userProperties.length > 0 ? (
        <ul>
          {userProperties.map((property, index) => (
            <li key={`user-property-${index}`} style={{ marginBottom: '10px' }}>
              <strong>{property.address}</strong><br />
              {property.neighborhood}<br />
              {property.current_price ? `Price: $${property.current_price}` : 'No price available'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties added yet.</p>
      )}

      <button
        style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#007BFF', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
        onClick={handleAddProperty} // Navigate to add property page
      >
        Add Property
      </button>
    </div>
  );
};

export default PropertySidebar;
