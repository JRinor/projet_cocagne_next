// pages/api/tournees.js
import pool from 'lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(`
        SELECT ID_Tournee, jour_preparation, jour_livraison, statut_tournee
        FROM Tournee
        ORDER BY ID_Tournee
      `);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Aucune tournée trouvée.' });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des tournées :', error);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
  }
}
