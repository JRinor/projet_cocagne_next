import pool from 'lib/db';

export default async function handler(req, res) {
  const tourneeId = req.query.id;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(`
        SELECT pd.ID_PointDeDepot, pd.nom, pd.adresse, pd.latitude, pd.longitude 
        FROM PointDeDepot pd
        JOIN Tournee_PointDeDepot tpd ON pd.ID_PointDeDepot = tpd.ID_PointDeDepot
        WHERE tpd.ID_Tournee = $1
      `, [tourneeId]);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des points de dépôt', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'DELETE') {
    const { id_pointdedepot } = req.body;

    if (!id_pointdedepot) {
      return res.status(400).json({ error: 'Le champ id_pointdedepot est requis.' });
    }

    try {
      const result = await pool.query(`
        DELETE FROM Tournee_PointDeDepot 
        WHERE ID_Tournee = $1 AND ID_PointDeDepot = $2
      `, [tourneeId, id_pointdedepot]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Point de dépôt non trouvé dans cette tournée.' });
      }

      return res.status(200).json({ message: 'Point de dépôt supprimé de la tournée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression du point de dépôt', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}