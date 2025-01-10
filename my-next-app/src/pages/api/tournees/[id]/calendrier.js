import pool from 'lib/db';

export default async function handler(req, res) {
  const { id } = req.query; // ID de la tournée dans l'URL

  if (req.method === 'GET') {
    // Récupérer le calendrier d'une tournée
    try {
      const { rows } = await pool.query(
        'SELECT * FROM Tournee WHERE ID_Tournee = $1',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tournée non trouvée' });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    // Ajouter ou mettre à jour un calendrier
    const { jour_preparation, jour_livraison } = req.body;

    if (!jour_preparation || !jour_livraison) {
      return res
        .status(400)
        .json({ error: 'Les champs jour_preparation et jour_livraison sont requis' });
    }

    try {
      const { rows } = await pool.query(
        'UPDATE Tournee SET jour_preparation = $1, jour_livraison = $2 WHERE ID_Tournee = $3 RETURNING *',
        [jour_preparation, jour_livraison, id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tournée non trouvée' });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    // Méthode non supportée
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}