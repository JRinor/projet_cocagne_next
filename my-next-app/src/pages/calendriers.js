// filepath: /c:/Users/victus/Documents/GitHub/projet_cocagne_3/my-next-app/src/pages/calendriers.js
import { useState, useEffect } from 'react';

const Calendriers = () => {
  const [tournees, setTournees] = useState([]);
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [calendrier, setCalendrier] = useState({ jour_preparation: '', jour_livraison: '' });

  useEffect(() => {
    fetch('/api/tournees')
      .then(res => res.json())
      .then(data => setTournees(data));
  }, []);

  const handleTourneeSelect = (id) => {
    fetch(`/api/tournees/${id}/calendrier`)
      .then(res => res.json())
      .then(data => {
        setSelectedTournee(id);
        setCalendrier(data);
      });
  };

  const handleSaveCalendrier = () => {
    fetch(`/api/tournees/${selectedTournee}/calendrier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendrier),
    })
      .then(res => res.json())
      .then(data => {
        alert('Calendrier mis à jour avec succès');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Calendriers</h1>
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
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Modifier le calendrier</h2>
          <div className="flex space-x-4">
            <input
              type="date"
              placeholder="Jour de préparation"
              value={calendrier.jour_preparation}
              onChange={(e) => setCalendrier({ ...calendrier, jour_preparation: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
            <input
              type="date"
              placeholder="Jour de livraison"
              value={calendrier.jour_livraison}
              onChange={(e) => setCalendrier({ ...calendrier, jour_livraison: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <button
            onClick={handleSaveCalendrier}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Enregistrer le calendrier
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendriers;