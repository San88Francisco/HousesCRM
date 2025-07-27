/**
 * @swagger
 * /renters/tenant:
 *   post:
 *     summary: Створення нового орендаря
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenterInput'
 *     responses:
 *       201:
 *         description: Орендаря успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Орендаря успішно створено"
 *                 renter:
 *                   $ref: '#/components/schemas/Renter'
 *       400:
 *         description: Помилка валідації даних
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Квартиру не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Не вдалося зберегти дані
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /renters/tenants:
 *   get:
 *     summary: Отримати всіх орендарів з пагінацією
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер сторінки
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Кількість елементів на сторінці
 *         example: 10
 *       - in: query
 *         name: house_id
 *         schema:
 *           type: string
 *         description: Фільтр по ID квартири (опціонально)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Список орендарів з інформацією про пагінацію
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentersResponse'
 *       400:
 *         description: Помилка валідації параметрів
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Не вдалося отримати дані
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /renters/tenant/{id}:
 *   get:
 *     summary: Отримати орендаря за ID
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID орендаря
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Інформація про орендаря
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 renter:
 *                   $ref: '#/components/schemas/Renter'
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Орендаря не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Не вдалося отримати дані
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /renters/tenant/{id}:
 *   patch:
 *     summary: Оновлення орендаря за ID
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID орендаря
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               house_id:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               name:
 *                 type: string
 *                 example: "Оновлене ім'я"
 *               start:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-01"
 *               finish:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               pricePerMonth:
 *                 type: number
 *                 example: 15000
 *             description: "Поля для оновлення (всі опціональні)"
 *     responses:
 *       200:
 *         description: Орендаря успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Орендаря успішно оновлено"
 *                 renter:
 *                   $ref: '#/components/schemas/Renter'
 *       400:
 *         description: Помилка валідації даних
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Орендаря не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Не вдалося оновити орендаря
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /renters/tenant/{id}:
 *   delete:
 *     summary: Видалення орендаря за ID
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID орендаря
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Орендаря успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Орендаря успішно видалено"
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Орендаря не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Не вдалося видалити орендаря
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
