import { useState, useEffect } from 'react';
import Map from '../components/Map';

const Tournees = () => {
  const [tournees, setTournees] = useState([]);
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState({ ID_PointDeDepot: '', nom: '', adresse: '', latitude: '', longitude: '', numero_ordre: '' });
  const [error, setError] = useState('');

  // Récupération des tournées au chargement de la page
  useEffect(() => {
    fetch('/api/tournees')
      .then(res => res.json())
      .then(data => {
        console.log('Données reçues de l\'API:', data); // Ajoutez ce log pour vérifier les données
        if (Array.isArray(data)) {
          setTournees(data);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau', data);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des tournées', error);
      });
  }, []);

  // Sélection d'une tournée et récupération de ses points de dépôt
  const handleTourneeSelect = (id) => {
    fetch(`/api/tournees/${id}/points`)
      .then(res => res.json())
      .then(data => {
        setSelectedTournee(id);
        setPoints(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des points de dépôt', error);
      });
  };

  // Ajout d'un nouveau point de dépôt à la liste locale
  const handleAddPoint = () => {
    if (!newPoint.ID_PointDeDepot || !newPoint.nom || !newPoint.adresse || !newPoint.latitude || !newPoint.longitude || !newPoint.numero_ordre) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    setPoints([...points, newPoint]);
    setNewPoint({ ID_PointDeDepot: '', nom: '', adresse: '', latitude: '', longitude: '', numero_ordre: '' });
    setError('');
  };

  // Enregistrement des points de dépôt pour la tournée sélectionnée
  const handleSaveTournee = () => {
    fetch(`/api/tournees/${selectedTournee}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(points),
    })
      .then(res => res.json())
      .then(data => {
        alert('Tournee mise à jour avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la tournée', error);
        alert('Erreur lors de la mise à jour de la tournée');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Tournées</h1>
      <div className="mb-4">
        <label htmlFor="tournee" className="block text-sm font-medium text-gray-700">Sélectionner une tournée</label>
        <select
          id="tournee"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={(e) => handleTourneeSelect(e.target.value)}
        >
          <option value="">Sélectionner une tournée</option>
          {tournees.map(tournee => (
            <option key={tournee.id_tournee} value={tournee.id_tournee}>
              {tournee.jour_livraison}
            </option>
          ))}
        </select>
      </div>
      {selectedTournee && (
        <>
          <Map points={points} />
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Ajouter un point de dépôt</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="text"
                placeholder="ID Point de Dépôt"
                value={newPoint.ID_PointDeDepot}
                onChange={(e) => setNewPoint({ ...newPoint, ID_PointDeDepot: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <input
                type="text"
                placeholder="Nom"
                value={newPoint.nom}
                onChange={(e) => setNewPoint({ ...newPoint, nom: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={newPoint.adresse}
                onChange={(e) => setNewPoint({ ...newPoint, adresse: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <input
                type="text"
                placeholder="Latitude"
                value={newPoint.latitude}
                onChange={(e) => setNewPoint({ ...newPoint, latitude: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={newPoint.longitude}
                onChange={(e) => setNewPoint({ ...newPoint, longitude: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <input
                type="text"
                placeholder="Ordre"
                value={newPoint.numero_ordre}
                onChange={(e) => setNewPoint({ ...newPoint, numero_ordre: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <button
                onClick={handleAddPoint}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Ajouter
              </button>
            </div>
            <button
              onClick={handleSaveTournee}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Enregistrer la tournée
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tournees;