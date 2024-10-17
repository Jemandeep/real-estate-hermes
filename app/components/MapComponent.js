import { MapContainer, TileLayer, GeoJSON, CircleMarker, useMap, Popup } from 'react-leaflet';
import { useEffect, useState, memo } from 'react';
import 'leaflet/dist/leaflet.css'; 

const FitBoundsToGeoJSON = ({ geoData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData) {
      const geoJsonLayer = L.geoJSON(geoData);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds);
    }
  }, [geoData, map]);

  return null;
};

const MapComponent = memo(({ favoriteProperties, listings }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON data for community boundaries
    fetch('/community-district-boundaries.geojson')
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, []);

  const style = {
    color: 'green',
    weight: 2,
    fillColor: 'green',
    fillOpacity: 0.3,
  };

  // Ensure favoriteProperties and listings have valid latitude and longitude values
  console.log('Favorite Properties:', favoriteProperties);
  console.log('All Listings:', listings);

  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      zoom={11}
      center={[51.0447, -114.0719]} // Center on Calgary
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render GeoJSON data for community boundaries */}
      {geoData && (
        <>
          <GeoJSON data={geoData} style={style} />
          <FitBoundsToGeoJSON geoData={geoData} />
        </>
      )}

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
  );
});

export default MapComponent;
