import pool from 'lib/db';

/**
 * @swagger
 * /tournees/{id}/calendrier:
 *   get:
 *     summary: Récupérer le calendrier d'une tournée
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
 *         description: Calendrier de la tournée récupéré avec succès
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
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 *   post:
 *     summary: Ajouter ou mettre à jour le calendrier d'une tournée
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
 *             type: object
 *             properties:
 *               jour_preparation:
 *                 type: string
 *                 format: date
 *               jour_livraison:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Calendrier de la tournée mis à jour avec succès
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
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 */
const isHoliday = async (date) => {
  const { rows } = await pool.query('SELECT * FROM Calendrier WHERE date = $1 AND type = $2', [date, 'ferie']);
  return rows.length > 0;
};

const isOpenWeek = async (date) => {
  const { rows } = await pool.query('SELECT * FROM Calendrier WHERE date = $1 AND type = $2', [date, 'ouverture']);
  return rows.length > 0;
};

const getNextAvailableDate = async (date) => {
  let nextDate = new Date(date);
  while (await isHoliday(nextDate) || !await isOpenWeek(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return nextDate.toISOString().split('T')[0];
};

export default async function handler(req, res) {
  const { id } = req.query; // ID de la tournée dans l'URL

  if (req.method === 'GET') {
    // Récupérer le calendrier d'une tournée
    try {
      const { rows } = await pool.query(
        'SELECT * FROM Tournee WHERE ID_Tournee = $1',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tournée non trouvée' });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    // Ajouter ou mettre à jour un calendrier
    const { jour_preparation, jour_livraison } = req.body;

    if (!jour_preparation || !jour_livraison) {
      return res
        .status(400)
        .json({ error: 'Les champs jour_preparation et jour_livraison sont requis' });
    }

    try {
      const nextPreparationDate = await getNextAvailableDate(jour_preparation);
      const nextDeliveryDate = await getNextAvailableDate(jour_livraison);

      const { rows } = await pool.query(
        'UPDATE Tournee SET jour_preparation = $1, jour_livraison = $2 WHERE ID_Tournee = $3 RETURNING *',
        [nextPreparationDate, nextDeliveryDate, id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Tournée non trouvée' });
      }

      // Ajouter une entrée dans l'historique
      await pool.query(
        'INSERT INTO Tournee_Historique (ID_Tournee, jour_preparation, jour_livraison, statut_tournee) VALUES ($1, $2, $3, $4)',
        [id, nextPreparationDate, nextDeliveryDate, rows[0].statut_tournee]
      );

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    // Méthode non supportée
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}