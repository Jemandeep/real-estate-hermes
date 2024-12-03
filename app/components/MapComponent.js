import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { memo } from 'react';
import 'leaflet/dist/leaflet.css';
import PropertySidebar from './PropertySidebar'; // Import the PropertySidebar component

const MapComponent = memo(({ userProperties = [], listings = [], onAddProperty }) => {

  return (
    <div className="map-layout" style={{ display: 'flex', gap: '20px', justifyContent: 'left', alignItems: 'flex-start' }}>


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

          {/* Display user properties as red markers */}
          {userProperties.length > 0 && userProperties.map((property, index) => {
            if (!property.latitude || !property.longitude) {
              console.warn('User property missing latitude or longitude:', property);
              return null;
            }

            return (
              <CircleMarker
                key={`user-property-${index}`}
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
                pathOptions={{ color: 'black', fillColor: 'red', fillOpacity: 0.5 }}
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
