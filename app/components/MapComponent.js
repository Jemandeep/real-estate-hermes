import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, memo } from 'react';
import 'leaflet/dist/leaflet.css';

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
      center={[51.0447, -114.0719]} // Center the map on Calgary (Latitude, Longitude)
      zoom={11} // Adjust zoom level for better rendering with EPSG:4326
      style={{ height: '600px', width: '100%' }}
      crs={L.CRS.EPSG4326} // Use EPSG:4326 (WGS84) projection for correct rendering
    >
      {/* TileLayer from OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Render GeoJSON data if available */}
      {geoData && <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
});

export default MapComponent;
