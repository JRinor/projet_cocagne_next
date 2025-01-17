import pool from 'lib/db';

/**
 * @swagger
 * /tournees/{id}/points:
 *   get:
 *     summary: Récupérer les points de dépôt d'une tournée
 *     tags: [Tournees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tournée
 *     responses:
 *       200:
 *         description: Liste des points de dépôt récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pointdedepot:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   adresse:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   numero_ordre:
 *                     type: integer
 *       404:
 *         description: Aucun point de dépôt trouvé pour cette tournée
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Ajouter ou mettre à jour les points de dépôt d'une tournée
 *     tags: [Tournees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tournée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id_pointdedepot:
 *                   type: integer
 *                 numero_ordre:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Points de dépôt mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pointdedepot:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   adresse:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   numero_ordre:
 *                     type: integer
 *       400:
 *         description: Les points doivent être un tableau
 *       404:
 *         description: La tournée avec l'ID spécifié n'existe pas
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  const { id } = req.query; // ID de la tournée

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT pd.id_pointdedepot, pd.nom, pd.adresse, pd.latitude, pd.longitude, tpd.numero_ordre ' +
        'FROM Tournee_PointDeDepot tpd ' +
        'JOIN PointDeDepot pd ON tpd.ID_PointDeDepot = pd.id_pointdedepot ' +
        'WHERE tpd.ID_Tournee = $1 ' +
        'ORDER BY tpd.numero_ordre',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Aucun point de dépôt trouvé pour cette tournée' });
      }

      console.log('Points de dépôt récupérés:', rows);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des points de dépôt', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    const { points } = req.body; // Liste des points à associer (avec l'ordre)

    if (!Array.isArray(points)) {
      console.error('Les points doivent être un tableau');
      return res.status(400).json({ error: 'Les points doivent être un tableau' });
    }

    try {
      // Vérifier si la tournée existe
      console.log('Vérification de l\'existence de la tournée', id);
      const { rowCount: tourneeExists } = await pool.query(
        'SELECT 1 FROM Tournee WHERE ID_Tournee = $1',
        [id]
      );

      if (tourneeExists === 0) {
        return res.status(404).json({ error: `La tournée avec l'ID ${id} n'existe pas` });
      }

      console.log('Début de la transaction');
      await pool.query('BEGIN');

      // Supprimer les points existants pour la tournée
      console.log('Suppression des points existants pour la tournée', id);
      await pool.query('DELETE FROM Tournee_PointDeDepot WHERE ID_Tournee = $1', [id]);

      // Vérifier l'existence des points de dépôt
      for (const { id_pointdedepot } of points) {
        if (!id_pointdedepot) {
          throw new Error('id_pointdedepot est requis');
        }
        const { rowCount } = await pool.query(
          'SELECT 1 FROM PointDeDepot WHERE id_pointdedepot = $1',
          [id_pointdedepot]
        );
        if (rowCount === 0) {
          throw new Error(`Le point de dépôt avec l'ID ${id_pointdedepot} n'existe pas`);
        }
      }

      // Ajouter les nouveaux points
      for (const { id_pointdedepot, numero_ordre } of points) {
        console.log('Ajout du point', id_pointdedepot, 'avec l\'ordre', numero_ordre);
        await pool.query(
          'INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre, ID_Statut) VALUES ($1, $2, $3, $4)',
          [id, id_pointdedepot, numero_ordre, 1] // Assurez-vous que le statut par défaut est défini
        );
      }

      console.log('Commit de la transaction');
      await pool.query('COMMIT');

      // Récupérer les points de dépôt mis à jour
      const { rows } = await pool.query(
        'SELECT pd.id_pointdedepot, pd.nom, pd.adresse, pd.latitude, pd.longitude, tpd.numero_ordre ' +
        'FROM Tournee_PointDeDepot tpd ' +
        'JOIN PointDeDepot pd ON tpd.ID_PointDeDepot = pd.id_pointdedepot ' +
        'WHERE tpd.ID_Tournee = $1 ' +
        'ORDER BY tpd.numero_ordre',
        [id]
      );

      console.log('Points de dépôt mis à jour:', rows);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la transaction, rollback', error);
      await pool.query('ROLLBACK');
      return res.status(500).json({
        error: 'Erreur serveur',
        details: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}