import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { memo } from 'react';
import 'leaflet/dist/leaflet.css';
import PropertySidebar from './PropertySidebar'; // Import the new PropertySidebar component

const MapComponent = memo(({ favoriteProperties = [], listings = [], userProperties = [], onAddProperty }) => {

  return (
    <div className="map-layout" style={{ display: 'flex', gap: '20px', justifyContent: 'left', alignItems: 'flex-start' }}>
      {/* Sidebar for user properties */}
      <PropertySidebar userProperties={userProperties} onAddProperty={onAddProperty} /> {/* Pass props */}

      {/* Box for the Map */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff', 
        border: '1px solid #ddd', 
        borderRadius: '8px', // Box around the map
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Slight shadow for depth
      }}>
        <MapContainer
          style={{ width: '400px', height: '350px' }} // Map container as a rectangle
          zoom={10}
          center={[51.0447, -114.0719]} // Center on Calgary
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Display favorite properties as red markers */}
          {favoriteProperties.length > 0 && favoriteProperties.map((property, index) => {
            if (!property.latitude || !property.longitude) {
              console.warn('Favorite property missing latitude or longitude:', property);
              return null;
            }

            return (
              <CircleMarker
                key={`fav-${index}`}
                center={[property.latitude, property.longitude]}
                radius={8}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.7 }}
              >
                <Popup>
                  <strong>{property.address}</strong><br />
                  {property.neighborhood}
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Display all listings as blue markers */}
          {listings.length > 0 && listings.map((property, index) => {
            if (!property.latitude || !property.longitude) {
              console.warn('Listing missing latitude or longitude:', property);
              return null;
            }

            return (
              <CircleMarker
                key={`listing-${index}`}
                center={[property.latitude, property.longitude]}
                radius={6}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }}
              >
                <Popup>
                  <strong>{property.address}</strong><br />
                  {property.neighborhood}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
});

export default MapComponent;
