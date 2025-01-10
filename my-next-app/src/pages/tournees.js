// filepath: /c:/Users/victus/Documents/GitHub/projet_cocagne_3/my-next-app/src/pages/tournees.js
import { useState, useEffect } from 'react';
import Map from '../components/Map';

const Tournees = () => {
  const [tournees, setTournees] = useState([]);
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState({ id: '', ordre: '' });

  useEffect(() => {
    fetch('/api/tournees')
      .then(res => res.json())
      .then(data => setTournees(data));
  }, []);

  const handleTourneeSelect = (id) => {
    fetch(`/api/tournees/${id}/points`)
      .then(res => res.json())
      .then(data => {
        setSelectedTournee(id);
        setPoints(Array.isArray(data) ? data : []);
      });
  };

  const handleAddPoint = () => {
    setPoints([...points, newPoint]);
    setNewPoint({ id: '', ordre: '' });
  };

  const handleSaveTournee = () => {
    fetch(`/api/tournees/${selectedTournee}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points }),
    })
      .then(res => res.json())
      .then(data => {
        alert('Tournee mise à jour avec succès');
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
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="ID Point de Dépôt"
                value={newPoint.id}
                onChange={(e) => setNewPoint({ ...newPoint, id: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <input
                type="text"
                placeholder="Ordre"
                value={newPoint.ordre}
                onChange={(e) => setNewPoint({ ...newPoint, ordre: e.target.value })}
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