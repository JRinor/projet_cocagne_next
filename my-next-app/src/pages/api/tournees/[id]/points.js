import pool from 'lib/db';

/**
 * @swagger
 * /tournees/{id}/points:
 *   post:
 *     summary: Mettre à jour les points de dépôt d'une tournée
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
 *                 ID_PointDeDepot:
 *                   type: integer
 *                 numero_ordre:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Points de dépôt mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Les points doivent être un tableau
 *       404:
 *         description: La tournée avec l'ID spécifié n'existe pas
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  const { id } = req.query; // ID de la tournée

  if (req.method === 'POST') {
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
      for (const { ID_PointDeDepot } of points) {
        const { rowCount } = await pool.query(
          'SELECT 1 FROM PointDeDepot WHERE ID_PointDeDepot = $1',
          [ID_PointDeDepot]
        );
        if (rowCount === 0) {
          throw new Error(`Le point de dépôt avec l'ID ${ID_PointDeDepot} n'existe pas`);
        }
      }

      // Ajouter les nouveaux points
      for (const { ID_PointDeDepot, numero_ordre } of points) {
        console.log('Ajout du point', ID_PointDeDepot, 'avec l\'ordre', numero_ordre);
        await pool.query(
          'INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre) VALUES ($1, $2, $3)',
          [id, ID_PointDeDepot, numero_ordre]
        );
      }

      console.log('Commit de la transaction');
      await pool.query('COMMIT');
      return res.status(200).json({ message: 'Points mis à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la transaction, rollback', error);
      await pool.query('ROLLBACK');
      return res.status(500).json({
        error: 'Erreur serveur',
        details: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}