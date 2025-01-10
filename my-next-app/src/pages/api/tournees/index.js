import pool from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { jour_livraison } = req.query;
    try {
      let query;
      let params;
      if (jour_livraison) {
        query = 'SELECT * FROM Tournee WHERE jour_livraison = $1';
        params = [jour_livraison];
      } else {
        query = 'SELECT * FROM Tournee';
        params = [];
      }
      const { rows } = await pool.query(query, params);
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    const { jour_preparation, jour_livraison } = req.body;

    if (!jour_preparation || !jour_livraison) {
      return res
        .status(400)
        .json({ error: 'Les champs jour_preparation et jour_livraison sont requis' });
    }

    try {
      const { rows } = await pool.query(
        'INSERT INTO Tournee (jour_preparation, jour_livraison) VALUES ($1, $2) RETURNING *',
        [jour_preparation, jour_livraison]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}