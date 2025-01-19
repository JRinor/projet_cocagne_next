import pool from 'lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
  }

  if (isNaN(id)) {
    console.error('ID de tournée invalide :', id);
    return res.status(400).json({ error: 'ID de tournée invalide.' });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT pd.nom, pd.adresse, pd.latitude, pd.longitude
      FROM PointDeDepot pd
      INNER JOIN Tournee_PointDeDepot tpd ON pd.ID_PointDeDepot = tpd.ID_PointDeDepot
      WHERE tpd.ID_Tournee = $1
      ORDER BY tpd.numero_ordre
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aucun point de dépôt trouvé pour cette tournée.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des points de dépôt :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}
