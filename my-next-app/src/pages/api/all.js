import pool from 'lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
    }

    try {
        const client = await pool.connect();
        try {
            const query = `
                SELECT nom, adresse, latitude, longitude
                FROM PointDeDepot
                ORDER BY nom
            `;
            const result = await client.query(query);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Aucun point de dépôt trouvé.' });
            }

            res.status(200).json(result.rows);
        } finally {
            client.release(); // Libère la connexion
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des points de dépôt :', error);
        res.status(500).json({ error: 'Erreur serveur. Vérifiez la connexion à la base de données.' });
    }
}
