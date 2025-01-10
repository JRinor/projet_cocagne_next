import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

const Map = ({ points }) => {
  if (!Array.isArray(points)) {
    return null; // or handle the error appropriately
  }

  const polyline = points.map(point => [point.latitude, point.longitude]);

  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]} />
      ))}
      <Polyline positions={polyline} color="blue" />
    </MapContainer>
  );
};

export default Map;