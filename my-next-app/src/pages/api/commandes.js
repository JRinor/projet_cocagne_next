import pool from 'lib/db';
import { validateCommande } from 'lib/validation';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_abonnement, id_point_de_depot, quantite, date_livraison } = req.body;

    // Validate request body
    const { error } = validateCommande(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const query = `
        INSERT INTO Commande (ID_Abonnement, ID_PointDeDepot, quantite, date_commande)
        VALUES ($1, $2, $3, $4) RETURNING *
      `;
      const { rows } = await pool.query(query, [id_abonnement, id_point_de_depot, quantite, date_livraison]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}