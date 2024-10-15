import { MapContainer, TileLayer, GeoJSON, CircleMarker, useMap } from 'react-leaflet';
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

const MapComponent = memo(({ onSelectCommunity, favoriteProperties }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
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

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        onSelectCommunity(feature.properties.name);
      },
    });
  };

  // Ensure favoriteProperties has valid latitude and longitude values
  console.log('Favorite Properties:', favoriteProperties);

  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      zoom={11}
      center={[51.0447, -114.0719]} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {geoData && (
        <>
          <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
          <FitBoundsToGeoJSON geoData={geoData} />
        </>
      )}

      {favoriteProperties && favoriteProperties.map((property, index) => {
        if (!property.latitude || !property.longitude) {
          console.warn('Missing latitude or longitude for:', property);
          return null;
        }

        return (
          <CircleMarker
            key={index}
            center={[property.latitude, property.longitude]}
            radius={8}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.7 }}
          />
        );
      })}
    </MapContainer>
  );
});

export default MapComponent;
