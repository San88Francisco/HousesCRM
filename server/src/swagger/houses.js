/**
 * @swagger
 * /houses/apartment:
 *   post:
 *     summary: Створення нової квартири
 *     tags: [Houses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApartmentInput'
 *     responses:
 *       201:
 *         description: Квартиру успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Квартиру успішно створено"
 *                 apartment:
 *                   $ref: '#/components/schemas/Apartment'
 *       400:
 *         description: Помилка валідації даних
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
 * /houses/apartments:
 *   get:
 *     summary: Отримати всі квартири з пагінацією
 *     tags: [Houses]
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
 *     responses:
 *       200:
 *         description: Список квартир з інформацією про пагінацію
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentsResponse'
 *       400:
 *         description: Помилка валідації параметрів пагінації
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
 * /houses/apartment/{id}:
 *   delete:
 *     summary: Видалення квартири за ID
 *     tags: [Houses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID квартири
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Квартиру успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Квартиру успішно видалено"
 *       400:
 *         description: Невірний формат ID
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
 *         description: Не вдалося видалити квартиру
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
