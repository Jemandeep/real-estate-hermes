import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, memo } from 'react';
import 'leaflet/dist/leaflet.css';

// Component to adjust map bounds to GeoJSON data
const FitBoundsToGeoJSON = ({ geoData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData) {
      const geoJsonLayer = L.geoJSON(geoData);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds); // Adjust the map to fit the GeoJSON bounds
    }
  }, [geoData, map]);

  return null;
};

const MapComponent = memo(({ onSelectCommunity }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON data
    fetch('/community-district-boundaries.geojson') // Adjust the path to your GeoJSON file
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error('Error loading GeoJSON:', error));
  }, []);

  const style = {
    color: '#4CAF50',
    weight: 2,
    fillColor: '#6DBF67',
    fillOpacity: 0.5,
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onSelectCommunity(feature.properties.name); // Pass community selection
      },
    });
  };

  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      zoom={11} // Default zoom level
      center={[51.0447, -114.0719]} // Default center (Calgary)
    >
      {/* TileLayer from OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Render GeoJSON data and fit bounds to it */}
      {geoData && (
        <>
          <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
          <FitBoundsToGeoJSON geoData={geoData} /> {/* Adjust map bounds to GeoJSON */}
        </>
      )}
    </MapContainer>
  );
});

export default MapComponent;
