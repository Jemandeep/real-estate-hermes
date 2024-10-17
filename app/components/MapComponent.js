import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { memo } from 'react';
import 'leaflet/dist/leaflet.css';

const MapComponent = memo(({ favoriteProperties, listings }) => {
  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      zoom={11}
      center={[51.0447, -114.0719]} // Default center of the map
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render favorite properties as CircleMarkers */}
      {favoriteProperties && favoriteProperties.map((property, index) => {
        if (!property.latitude || !property.longitude) {
          console.warn('Missing latitude or longitude for:', property);
          return null;
        }

        return (
          <CircleMarker
            key={index}
            center={[property.latitude, property.longitude]} // Position marker using coordinates
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

      {/* Optional: Render listings as blue markers (non-favorite properties) */}
      {listings && listings.map((property, index) => {
        if (!property.latitude || !property.longitude) {
          console.warn('Missing latitude or longitude for:', property);
          return null;
        }

        return (
          <CircleMarker
            key={index}
            center={[property.latitude, property.longitude]} // Position marker using coordinates
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
  );
});

export default MapComponent;
