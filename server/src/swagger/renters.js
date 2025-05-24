/**
 * @swagger
 * /renters/tenant:
 *   post:
 *     summary: Створення нового жильця
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantInput'
 *     responses:
 *       201:
 *         description: Жильця успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Жильця успішно створено"
 *                 tenant:
 *                   $ref: '#/components/schemas/Tenant'
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
 *     summary: Отримати всіх жильців з пагінацією
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
 *         description: Список жильців з інформацією про пагінацію
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantsResponse'
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
 *     summary: Отримати жильця за ID
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID жильця
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Інформація про жильця
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tenant:
 *                   $ref: '#/components/schemas/Tenant'
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Жильця не знайдено
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
 *     summary: Оновлення жильця за ID
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID жильця
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
 *         description: Жильця успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Жильця успішно оновлено"
 *                 tenant:
 *                   $ref: '#/components/schemas/Tenant'
 *       400:
 *         description: Помилка валідації даних
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Жильця не знайдено
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
 *         description: Не вдалося оновити жильця
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /renters/tenant/{id}:
 *   delete:
 *     summary: Видалення жильця за ID
 *     tags: [Renters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID жильця
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Жильця успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Жильця успішно видалено"
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Жильця не знайдено
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
 *         description: Не вдалося видалити жильця
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */