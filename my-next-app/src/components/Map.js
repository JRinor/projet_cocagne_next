import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const Map = ({ points }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    const L = require('leaflet');

    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([48.18333, 6.45], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Supprimer les anciens marqueurs et tracés
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    // Définir une icône personnalisée
    const customIcon = L.icon({
      iconUrl: '/img/icon.png', // Chemin absolu à partir de la racine du site
      iconSize: [32, 32], // Taille de l'icône
      iconAnchor: [16, 32], // Point de l'icône qui correspond à la position du marqueur
      popupAnchor: [0, -32] // Point à partir duquel la popup doit s'ouvrir par rapport à l'icône
    });

    // Ajouter les marqueurs et tracer le chemin
    const latLngs = points.map((point) => {
      const latLng = [parseFloat(point.latitude), parseFloat(point.longitude)];
      const marker = L.marker(latLng, { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong>${point.nom}</strong><br>${point.adresse}`);
      markersRef.current.push(marker);
      return latLng;
    });

    if (latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, { color: 'blue' }).addTo(mapRef.current);
      mapRef.current.fitBounds(polylineRef.current.getBounds());
    } else if (latLngs.length === 1) {
      mapRef.current.setView(latLngs[0], 13);
    }
  }, [points]);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });