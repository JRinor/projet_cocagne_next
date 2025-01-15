import pool from '../../../../lib/db';

/**
 * @swagger
 * /tournees:
 *   get:
 *     summary: Récupérer les tournées
 *     tags: [Tournees]
 *     parameters:
 *       - in: query
 *         name: jour_livraison
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par jour de livraison
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de résultats par page
 *     responses:
 *       200:
 *         description: Liste des tournées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_tournee:
 *                     type: integer
 *                   jour_preparation:
 *                     type: string
 *                     format: date
 *                   jour_livraison:
 *                     type: string
 *                     format: date
 *                   statut_tournee:
 *                     type: string
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Créer une nouvelle tournée
 *     tags: [Tournees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jour_preparation:
 *                 type: string
 *                 format: date
 *               jour_livraison:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tournée créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_tournee:
 *                   type: integer
 *                 jour_preparation:
 *                   type: string
 *                   format: date
 *                 jour_livraison:
 *                   type: string
 *                   format: date
 *                 statut_tournee:
 *                   type: string
 *       400:
 *         description: Les champs jour_preparation et jour_livraison sont requis
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { jour_livraison, statut, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
      let query = 'SELECT * FROM Tournee WHERE 1=1';
      let params = [];

      if (jour_livraison) {
        query += ' AND jour_livraison = $1';
        params.push(jour_livraison);
      }

      if (statut) {
        query += ' AND statut_tournee = $2';
        params.push(statut);
      }

      query += ' LIMIT $3 OFFSET $4';
      params.push(limit, offset);

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