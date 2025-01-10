import pool from 'lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, mot_de_passe } = req.body;

    try {
      const { rows } = await pool.query('SELECT * FROM AppUser WHERE email = $1', [email]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      const token = jwt.sign({ id: user.id_user, role: user.id_role }, 'votre_secret', { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}