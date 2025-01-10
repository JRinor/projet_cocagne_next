import Joi from 'joi';

// Schéma de validation pour une commande
const commandeSchema = Joi.object({
  id_abonnement: Joi.number().integer().required(),
  id_point_de_depot: Joi.number().integer().required(),
  quantite: Joi.number().integer().min(1).required(),
  date_livraison: Joi.date().iso().required()
});

// Fonction de validation pour une commande
export function validateCommande(commande) {
  return commandeSchema.validate(commande);
}