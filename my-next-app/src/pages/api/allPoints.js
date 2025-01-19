import pool from 'lib/db';

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Récupérer tous les points de dépôt
 *     tags: [Points]
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
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { structure_id } = req.query;
    try {
      let query = 'SELECT * FROM PointDeDepot';
      const params = [];
      
      if (structure_id) {
        query += ' WHERE ID_Structure = $1';
        params.push(structure_id);
      }
      
      const { rows } = await pool.query(query, params);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des points de dépôt', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}