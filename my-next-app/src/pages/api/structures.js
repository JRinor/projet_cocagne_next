import pool from '../../../lib/db';

/**
 * @swagger
 * /structures:
 *   get:
 *     summary: Récupérer toutes les structures
 *     tags: [Structures]
 *     responses:
 *       200:
 *         description: Liste des structures récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_structure:
 *                     type: integer
 *                   nom:
 *                     type: string
 *                   adresse:
 *                     type: string
 *                   coordonnees_bancaires:
 *                     type: string
 *                   siret:
 *                     type: string
 *       500:
 *         description: Erreur lors de la récupération des structures
 */
export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Structure');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving structures' });
  }
}