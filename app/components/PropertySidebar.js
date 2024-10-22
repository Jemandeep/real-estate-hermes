import React, { useEffect, useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase'; // Firebase configuration
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth

const PropertySidebar = () => {
  const [userProperties, setUserProperties] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Listen for auth changes and set the user
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    // Fetch the properties for the logged-in user
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('userEmail', '==', user.email) // Filter by the logged-in user's email
        );
        const querySnapshot = await getDocs(propertiesQuery);
        const properties = querySnapshot.docs.map((doc) => doc.data());
        setUserProperties(properties);
      } catch (error) {
        console.error('Error fetching properties: ', error);
      }
    };

    fetchProperties();
  }, [user]); // Re-run when user changes

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
        onClick={() => window.location.href = '/add-property'}
      >
        Add Property
      </button>
    </div>
  );
};

export default PropertySidebar;
