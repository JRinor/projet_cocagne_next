import pool from 'lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token manquant.' });
    }

    try {
      const decoded = jwt.verify(token, 'votre_secret');
      const { rows } = await pool.query('SELECT * FROM AppUser WHERE ID_User = $1', [decoded.id]);
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}