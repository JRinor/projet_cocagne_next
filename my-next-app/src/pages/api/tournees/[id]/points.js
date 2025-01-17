// filepath: /c:/Users/victus/Documents/GitHub/projet_cocagne_3/my-next-app/src/pages/api/tournees/[id]/points.js
import pool from 'lib/db';

/**
 * @swagger
 * /tournees/{id}/points:
 *   get:
 *     summary: Récupérer tous les points de dépôt pour une tournée spécifique
 *     tags: [Points-2]
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
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM PointDeDepot WHERE tournee_id = $1', [req.query.id]);
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