import pool from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT * FROM Structure');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving structures' });
  }
}