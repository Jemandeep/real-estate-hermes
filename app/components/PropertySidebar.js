import React from 'react';

const PropertySidebar = ({ userProperties, onAddProperty }) => {
  return (
    <div style={{ 
      width: '300px', 
      padding: '20px', 
      backgroundColor: '#f4f4f4', 
      border: '1px solid #ddd', 
      borderRadius: '8px', // Add border and rounded corners
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
      overflowY: 'auto' 
    }}>
      <h3>Your Properties</h3>
      
      {userProperties.length > 0 ? (
        <ul>
          {userProperties.map((property, index) => (
            <li key={`user-property-${index}`} style={{ marginBottom: '10px' }}>
              <strong>{property.address}</strong><br />
              {property.neighborhood}<br />
              {property.currentPrice ? `Price: $${property.currentPrice}` : 'No price available'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties added yet.</p>
      )}
      
      <button
        onClick={onAddProperty}
        style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#007BFF', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Add Property
      </button>
    </div>
  );
};

export default PropertySidebar;
