import pool from 'lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
    }

    const { id } = req.query; // ID de la tournée
    const { pointId, ordre } = req.body; // ID du point de dépôt et ordre d'ajout

    console.log("Requête reçue pour ajouter un point : ", { id, pointId, ordre });

    if (!id || !pointId) {
        console.log("Erreur : ID de tournée ou ID de point manquant.");
        return res.status(400).json({ error: 'Tournée ID ou Point ID manquant.' });
    }

    try {
        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre, ID_Statut)
                VALUES ($1, $2, $3, 1) -- Statut par défaut : "préparée"
                ON CONFLICT (ID_Tournee, ID_PointDeDepot) DO NOTHING;
            `;
            console.log("Exécution de la requête SQL avec les paramètres :", [id, pointId, ordre || 0]);

            await client.query(query, [id, pointId, ordre || 0]);

            console.log("Point ajouté avec succès !");
            res.status(200).json({ message: 'Point de dépôt ajouté à la tournée.' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du point de dépôt :', error);
        res.status(500).json({ error: 'Erreur serveur. Veuillez réessayer plus tard.' });
    }
}
