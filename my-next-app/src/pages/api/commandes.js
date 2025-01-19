// filepath: /c:/Users/victus/Documents/GitHub/projet_cocagne_3/my-next-app/src/pages/api/commandes.js
import pool from 'lib/db';
import { validateCommande } from 'lib/validation';

/**
 * @swagger
 * /commandes:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_abonnement:
 *                 type: integer
 *               id_point_de_depot:
 *                 type: integer
 *               quantite:
 *                 type: integer
 *               date_livraison:
 *                 type: string
 *                 format: date
 *               statut:
 *                 type: string
 *                 enum: [en attente, en cours, livrée, annulée]
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_commande:
 *                   type: integer
 *                 id_abonnement:
 *                   type: integer
 *                 id_point_de_depot:
 *                   type: integer
 *                 quantite:
 *                   type: integer
 *                 date_livraison:
 *                   type: string
 *                   format: date
 *                 statut:
 *                   type: string
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 *   put:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_commande:
 *                 type: integer
 *               statut:
 *                 type: string
 *                 enum: [en attente, en cours, livrée, annulée]
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_commande:
 *                   type: integer
 *                 statut:
 *                   type: string
 *       400:
 *         description: Les champs id_commande et statut sont requis
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_abonnement, id_point_de_depot, quantite, date_livraison, statut } = req.body;

    // Validate request body
    const { error } = validateCommande(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const statutsValides = ['en attente', 'en cours', 'livrée', 'annulée'];
    if (statut && !statutsValides.includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    try {
      const query = `