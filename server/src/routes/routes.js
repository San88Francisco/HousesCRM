const express = require('express');
const { createHouse, getHouses, deleteHouse, updateHouse } = require('../controllers/life-interval/life-interval');
const { registerUser, loginUser, refreshAccessToken } = require('../controllers/auth/auth');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Реєстрація нового користувача
 *     description: Додає нового користувача до системи.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *       400:
 *         description: Невірні дані
 *       500:
 *         description: Не вдалося зареєструвати користувача
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Логін користувача
 *     description: Логін користувача для отримання JWT токену.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успішний вхід, повертається JWT токен
 *       400:
 *         description: Невірні дані
 *       500:
 *         description: Не вдалося увійти
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Оновлення токену
 *     description: Оновлює токен за допомогою refresh токену.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Оновлений access токен
 *       400:
 *         description: Невірний refresh токен
 *       500:
 *         description: Не вдалося оновити токен
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @swagger
 * /api/create-house:
 *   post:
 *     summary: Створити новий будинок
 *     description: Створює новий запис для будинку в базі даних
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               finishDate:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Будинок успішно створено
 *       500:
 *         description: Не вдалося зберегти дані
 */
router.post('/create-house', createHouse);

/**
 * @swagger
 * /api/houses:
 *   get:
 *     summary: Отримати всі будинки
 *     description: Повертає список всіх будинків з бази даних
 *     responses:
 *       200:
 *         description: Список будинків
 *       500:
 *         description: Не вдалося отримати дані
 */
router.get('/houses', getHouses);

/**
 * @swagger
 * /api/houses/{id}:
 *   delete:
 *     summary: Видалити будинок за ID
 *     description: Видаляє будинок з бази даних за вказаним ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID будинку для видалення
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Будинок успішно видалено
 *       404:
 *         description: Будинок не знайдено
 *       500:
 *         description: Не вдалося видалити будинок
 */
router.delete('/houses/:id', deleteHouse);

/**
 * @swagger
 * /api/houses/{id}:
 *   patch:
 *     summary: Часткове оновлення будинку за ID
 *     description: Оновлює один або кілька параметрів будинку за вказаним ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID будинку для оновлення
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               finishDate:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Будинок успішно оновлено
 *       404:
 *         description: Будинок не знайдено
 *       500:
 *         description: Не вдалося оновити будинок
 */
router.patch('/houses/:id', updateHouse);

module.exports = router;
