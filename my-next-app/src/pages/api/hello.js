// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Test pour voir si l'API est bien lancée
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API lancée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: John Doe
 */
export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}