import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Définir une icône personnalisée avec un SVG
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const Map = ({ points }) => {
  if (!Array.isArray(points) || points.length === 0) {
    return <p className="text-center text-gray-500">Aucun point de dépôt disponible pour cette tournée.</p>;
  }

  const polyline = points.map(point => [point.latitude, point.longitude]);
  const center = polyline.length > 0 ? polyline[0] : [48.8566, 2.3522];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]} icon={customIcon}>
          <Popup>
            <div>
              <h3 className="font-bold">{point.nom}</h3>
              <p>{point.adresse}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <Polyline positions={polyline} color="blue" />
    </MapContainer>
  );
};

export default Map;