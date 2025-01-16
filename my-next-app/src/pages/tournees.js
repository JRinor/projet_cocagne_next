import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const Tournees = () => {
  const [tournees, setTournees] = useState([]);
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState({ id_pointdedepot: '', numero_ordre: '' });
  const [error, setError] = useState('');
  const [depots, setDepots] = useState([]); // Nouvel état pour les points de dépôt existants

  // Récupération des tournées au chargement de la page
  useEffect(() => {
    fetch('/api/tournees')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des tournées');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTournees(data);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau', data);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des tournées', error);
      });

    // Récupération des points de dépôt existants
    fetch('/api/points')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des points de dépôt');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setDepots(data);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau', data);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des points de dépôt', error);
      });
  }, []);

  // Sélection d'une tournée et récupération de ses points de dépôt
  const handleTourneeSelect = (id) => {
    fetch(`/api/tournees/${id}/points`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des points de dépôt');
        }
        return res.json();
      })
      .then(data => {
        setSelectedTournee(id);
        setPoints(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des points de dépôt', error);
      });
  };

  // Ajout d'un nouveau point de dépôt à la tournée
  const handleAddPoint = () => {
    if (!newPoint.id_pointdedepot || !newPoint.numero_ordre) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    fetch(`/api/tournees/${selectedTournee}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points: [...points, newPoint] }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de l\'ajout du point de dépôt');
        }
        return res.json();
      })
      .then(data => {
        setPoints(data);
        setNewPoint({ id_pointdedepot: '', numero_ordre: '' });
        setError('');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du point de dépôt', error);
        setError('Erreur lors de l\'ajout du point de dépôt');
      });
  };

  // Gestion du glisser-déposer
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedPoints = Array.from(points);
    const [movedPoint] = reorderedPoints.splice(result.source.index, 1);
    reorderedPoints.splice(result.destination.index, 0, movedPoint);

    setPoints(reorderedPoints);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestion des Tournées</h1>
      <div className="mb-6">
        <label htmlFor="tournee" className="block text-lg font-medium text-gray-700 mb-2">Sélectionner une tournée</label>
        <select
          id="tournee"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        <div className="mt-6">
          <Map points={points} />
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Ajouter un point de dépôt</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <select
                value={newPoint.id_pointdedepot}
                onChange={(e) => setNewPoint({ ...newPoint, id_pointdedepot: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Sélectionner un point de dépôt</option>
                {depots.map(depot => (
                  <option key={depot.id_pointdedepot} value={depot.id_pointdedepot}>
                    {depot.nom}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Numéro d'ordre"
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
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Réorganiser les points de dépôt</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="points">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {points.map((point, index) => (
                      point.id_pointdedepot && (
                        <Draggable key={point.id_pointdedepot} draggableId={point.id_pointdedepot.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 mb-2 rounded-md shadow-md flex justify-between items-center"
                            >
                              <span>{point.nom}</span>
                              <span>{point.numero_ordre}</span>
                            </div>
                          )}
                        </Draggable>
                      )
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournees;