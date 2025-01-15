import pool from 'lib/db';
import bcrypt from 'bcrypt';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription de l'utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nom, prenom, email, mot_de_passe, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    try {
      const { rows } = await pool.query(
        'INSERT INTO AppUser (nom, prenom, email, mot_de_passe, ID_Role) VALUES ($1, $2, $3, $4, (SELECT ID_Role FROM Role WHERE nom = $5)) RETURNING *',
        [nom, prenom, email, hashedPassword, role]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}