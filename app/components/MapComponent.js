import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { memo } from 'react';
import 'leaflet/dist/leaflet.css';

const MapComponent = memo(({ userProperties = [], listings = [], onAddProperty }) => {
  return (
    <div 
      className="map-layout" 
      style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'left', 
        alignItems: 'flex-start', 
        width: '100%', // Ensure it spans the full width of its parent
        height: '100%', // Ensure it spans the full height of its parent
        maxHeight: '400px', // Optional: limit the height to prevent it from overflowing
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%', // Ensure the div fills its parent container
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <MapContainer
          style={{
            width: '100%',
            height: '100%', // Ensures the map fills its container
          }}
          zoom={10}
          center={[51.0447, -114.0719]} // Center on Calgary
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Display user properties as red markers */}
          {userProperties.map((property, index) => (
            property.latitude && property.longitude && (
              <CircleMarker
                key={`user-property-${index}`}
                center={[property.latitude, property.longitude]}
                radius={8}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.7 }}
              >
                <Popup>
                  <strong>{property.address}</strong>
                  <br />
                  {property.neighborhood}
                </Popup>
              </CircleMarker>
            )
          ))}

          {/* Display all listings as blue markers */}
          {listings.map((property, index) => (
            property.latitude && property.longitude && (
              <CircleMarker
                key={`listing-${index}`}
                center={[property.latitude, property.longitude]}
                radius={6}
                pathOptions={{ color: 'black', fillColor: 'red', fillOpacity: 0.5 }}
              >
                <Popup>
                  <strong>{property.address}</strong>
                  <br />
                  {property.neighborhood}
                </Popup>
              </CircleMarker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
});

export default MapComponent;
