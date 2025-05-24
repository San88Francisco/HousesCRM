/**
 * @swagger
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Унікальний ідентифікатор договору
 *           example: "507f1f77bcf86cd799439011"
 *         tenant_id:
 *           type: string
 *           description: ID жильця
 *           example: "507f1f77bcf86cd799439011"
 *         originalStartDate:
 *           type: string
 *           format: date-time
 *           description: Оригінальна дата початку договору
 *           example: "2023-01-15T00:00:00.000Z"
 *         originalEndDate:
 *           type: string
 *           format: date-time
 *           description: Оригінальна дата закінчення договору
 *           example: "2025-12-31T00:00:00.000Z"
 *         adjustedStartDate:
 *           type: string
 *           format: date-time
 *           description: Обрізана дата початку для вибраного періоду
 *           example: "2024-01-15T00:00:00.000Z"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Дата початку договору (для окремого договору)
 *           example: "2024-01-15T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Дата закінчення договору (для окремого договору)
 *           example: "2024-12-31T00:00:00.000Z"
 *         monthlyPayment:
 *           type: number
 *           description: Місячна оплата
 *           example: 12000
 *         houseName:
 *           type: string
 *           description: Назва квартири/будинку
 *           example: "Квартира на Хрещатику"
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *           description: Статус договору (тільки для окремого договору)
 *           example: "active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення запису (тільки для окремого договору)
 *           example: "2025-05-24T13:15:42.702Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата останнього оновлення
 *           example: "2025-05-24T15:30:12.123Z"
 *         tenant:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *             name:
 *               type: string
 *               example: "Іван Петренко"
 *             house_id:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *         house:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *             apartmentName:
 *               type: string
 *               example: "Квартира на Хрещатику"
 *             street:
 *               type: string
 *               example: "вул. Хрещатик, 25"
 *             floor:
 *               type: integer
 *               example: 5
 *             roomsCount:
 *               type: integer
 *               example: 3
 *     
 *     ContractInput:
 *       type: object
 *       required:
 *         - tenant_id
 *         - startDate
 *         - endDate
 *         - monthlyPayment
 *       properties:
 *         tenant_id:
 *           type: string
 *           description: ID жильця
 *           example: "507f1f77bcf86cd799439011"
 *         startDate:
 *           type: string
 *           format: date
 *           description: Дата початку договору
 *           example: "2024-01-15"
 *         endDate:
 *           type: string
 *           format: date
 *           description: Дата закінчення договору
 *           example: "2024-12-31"
 *         monthlyPayment:
 *           type: number
 *           minimum: 0
 *           description: Місячна оплата
 *           example: 12000
 *     
 *     ContractUpdate:
 *       type: object
 *       properties:
 *         tenant_id:
 *           type: string
 *           description: ID жильця
 *           example: "507f1f77bcf86cd799439011"
 *         startDate:
 *           type: string
 *           format: date
 *           description: Дата початку договору
 *           example: "2024-02-01"
 *         endDate:
 *           type: string
 *           format: date
 *           description: Дата закінчення договору
 *           example: "2024-12-31"
 *         monthlyPayment:
 *           type: number
 *           minimum: 0
 *           description: Місячна оплата
 *           example: 15000
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *           description: Статус договору
 *           example: "active"
 *     
 *     PeriodInfo:
 *       type: object
 *       properties:
 *         selected:
 *           type: string
 *           enum: [1month, 6months, 1year, 5years, 10years, 15years, all]
 *           description: Вибраний період
 *           example: "1year"
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Дата початку періоду
 *           example: "2024-01-01T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Дата закінчення періоду (зараз)
 *           example: "2025-01-01T00:00:00.000Z"
 *         description:
 *           type: string
 *           description: Опис періоду українською
 *           example: "За останній рік"
 *     
 *     ContractStatistics:
 *       type: object
 *       properties:
 *         totalContracts:
 *           type: integer
 *           description: Загальна кількість договорів в періоді
 *           example: 5
 *         totalRevenue:
 *           type: number
 *           description: |
 *             Загальний дохід за період. 
 *             Для стандартних періодів: monthlyPayment × кількість місяців
 *             - 1month = monthlyPayment × 1
 *             - 6months = monthlyPayment × 6  
 *             - 1year = monthlyPayment × 12
 *             - 5years = monthlyPayment × 60
 *             - 10years = monthlyPayment × 120
 *             - 15years = monthlyPayment × 180
 *             Для періоду "all": пропорційний розрахунок на основі реальних дат
 *           example: 72000
 *         averageMonthlyPayment:
 *           type: number
 *           description: Середня місячна оплата (totalRevenue / totalContracts)
 *           example: 12000
 *     
 *     ContractsResponse:
 *       type: object
 *       properties:
 *         contracts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contract'
 *         period:
 *           $ref: '#/components/schemas/PeriodInfo'
 *         statistics:
 *           $ref: '#/components/schemas/ContractStatistics'
 *     
 *     TenantContractsResponse:
 *       type: object
 *       properties:
 *         tenant:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439011"
 *             name:
 *               type: string
 *               example: "Іван Петренко"
 *         contracts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contract'
 *         totalContracts:
 *           type: integer
 *           example: 3
 *     
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Повідомлення про помилку
 *           example: "Помилка валідації даних"
 *         requiredFields:
 *           type: array
 *           items:
 *             type: string
 *           description: Список обов'язкових полів (для помилок валідації)
 *           example: ["tenant_id", "startDate", "endDate", "monthlyPayment"]
 */

/**
 * @swagger
 * /contracts/contract:
 *   post:
 *     summary: Створення нового договору
 *     description: Створює новий договір оренди для жильця з валідацією всіх полів
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractInput'
 *           examples:
 *             basic:
 *               summary: Базовий приклад
 *               value:
 *                 tenant_id: "507f1f77bcf86cd799439011"
 *                 startDate: "2024-01-15"
 *                 endDate: "2024-12-31"
 *                 monthlyPayment: 12000
 *             longTerm:
 *               summary: Довгостроковий договір
 *               value:
 *                 tenant_id: "507f1f77bcf86cd799439011"
 *                 startDate: "2024-01-01"
 *                 endDate: "2026-12-31"
 *                 monthlyPayment: 15000
 *     responses:
 *       201:
 *         description: Договір успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Договір успішно створено"
 *                 contract:
 *                   $ref: '#/components/schemas/Contract'
 *       400:
 *         description: Помилка валідації даних
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingFields:
 *                 summary: Відсутні обов'язкові поля
 *                 value:
 *                   message: "Обов'язкові поля: tenant_id, startDate, endDate, monthlyPayment"
 *                   requiredFields: ["tenant_id", "startDate", "endDate", "monthlyPayment"]
 *               invalidDates:
 *                 summary: Невірні дати
 *                 value:
 *                   message: "Дата початку має бути раніше дати закінчення"
 *               invalidPayment:
 *                 summary: Невірна оплата
 *                 value:
 *                   message: "Місячна оплата має бути більше нуля"
 *       404:
 *         description: Жильця не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Жильця з таким ID не знайдено"
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contracts/contracts:
 *   get:
 *     summary: Отримати всі договори з фільтрацією по періодах
 *     description: |
 *       Повертає список договорів з можливістю фільтрації по періодах.
 *       
 *       **Особливості обрізання дат:**
 *       - Якщо договір починається раніше вибраного періоду, `adjustedStartDate` буде встановлена на початок періоду
 *       - Оригінальні дати зберігаються в `originalStartDate` та `originalEndDate`
 *       
 *       **Доступні періоди:**
 *       - `1month` - за останній місяць
 *       - `6months` - за останні 6 місяців
 *       - `1year` - за останній рік
 *       - `5years` - за останні 5 років
 *       - `10years` - за останні 10 років
 *       - `15years` - за останні 15 років
 *       - `all` - за весь час (за замовчуванням)
 *       
 *       **Розрахунок доходу:**
 *       - Для стандартних періодів: `monthlyPayment × кількість місяців`
 *       - Для періоду "all": пропорційний розрахунок на основі реальних дат договору
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1month, 6months, 1year, 5years, 10years, 15years, all]
 *           default: all
 *         description: Період для фільтрації договорів
 *         example: "6months"
 *       - in: query
 *         name: tenant_id
 *         schema:
 *           type: string
 *         description: Фільтр по ID жильця (опціонально)
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Список договорів з інформацією про період та статистику
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContractsResponse'
 *             examples:
 *               sixMonthsPeriod:
 *                 summary: За останні 6 місяців
 *                 value:
 *                   contracts:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       tenant_id: "507f1f77bcf86cd799439012"
 *                       originalStartDate: "2020-01-15T00:00:00.000Z"
 *                       originalEndDate: "2024-12-31T00:00:00.000Z"
 *                       adjustedStartDate: "2024-11-24T18:02:49.168Z"
 *                       monthlyPayment: 12000
 *                       houseName: "Квартира на Хрещатику"
 *                       tenant:
 *                         _id: "507f1f77bcf86cd799439012"
 *                         name: "Іван Петренко"
 *                         house_id: "507f1f77bcf86cd799439013"
 *                       house:
 *                         _id: "507f1f77bcf86cd799439013"
 *                         apartmentName: "Квартира на Хрещатику"
 *                         street: "вул. Хрещатик, 25"
 *                         floor: 5
 *                   period:
 *                     selected: "6months"
 *                     startDate: "2024-11-24T18:02:49.168Z"
 *                     endDate: "2025-05-24T17:02:49.168Z"
 *                     description: "За останні 6 місяців"
 *                   statistics:
 *                     totalContracts: 1
 *                     totalRevenue: 72000
 *                     averageMonthlyPayment: 72000
 *               yearPeriod:
 *                 summary: За останній рік
 *                 value:
 *                   contracts:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       monthlyPayment: 12000
 *                       houseName: "Квартира на Хрещатику"
 *                   period:
 *                     selected: "1year"
 *                     description: "За останній рік"
 *                   statistics:
 *                     totalContracts: 1
 *                     totalRevenue: 144000
 *                     averageMonthlyPayment: 144000
 *               allTime:
 *                 summary: За весь час (пропорційний розрахунок)
 *                 value:
 *                   contracts:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       originalStartDate: "2023-01-01T00:00:00.000Z"
 *                       originalEndDate: "2025-12-31T00:00:00.000Z"
 *                       adjustedStartDate: "2023-01-01T00:00:00.000Z"
 *                       monthlyPayment: 12000
 *                       houseName: "Квартира на Хрещатику"
 *                   period:
 *                     selected: "all"
 *                     startDate: null
 *                     endDate: "2025-01-01T00:00:00.000Z"
 *                     description: "За весь час"
 *                   statistics:
 *                     totalContracts: 1
 *                     totalRevenue: 432000
 *                     averageMonthlyPayment: 432000
 *       400:
 *         description: Помилка валідації параметрів
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidPeriod:
 *                 summary: Невірний період
 *                 value:
 *                   message: "Невірний період. Доступні: 1month, 6months, 1year, 5years, 10years, 15years, all"
 *               invalidTenantId:
 *                 summary: Невірний ID жильця
 *                 value:
 *                   message: "Невірний формат tenant_id"
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contracts/contract/{id}:
 *   get:
 *     summary: Отримати договір за ID
 *     description: Повертає детальну інформацію про конкретний договір з даними про жильця та квартиру
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID договору
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Інформація про договір
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contract:
 *                   $ref: '#/components/schemas/Contract'
 *             example:
 *               contract:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 tenant_id: "507f1f77bcf86cd799439012"
 *                 startDate: "2024-01-15T00:00:00.000Z"
 *                 endDate: "2024-12-31T00:00:00.000Z"
 *                 monthlyPayment: 12000
 *                 status: "active"
 *                 createdAt: "2025-05-24T13:15:42.702Z"
 *                 tenant:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "Іван Петренко"
 *                   house_id: "507f1f77bcf86cd799439013"
 *                 house:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   apartmentName: "Квартира на Хрещатику"
 *                   street: "вул. Хрещатик, 25"
 *                   floor: 5
 *                   roomsCount: 3
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Невірний формат ID договору"
 *       404:
 *         description: Договір не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Договір не знайдено"
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contracts/contract/{id}:
 *   patch:
 *     summary: Оновлення договору за ID
 *     description: |
 *       Часткове оновлення договору. Можна оновити будь-які поля окремо або разом.
 *       
 *       **Валідації:**
 *       - Дата початку має бути раніше дати закінчення
 *       - Місячна оплата має бути більше нуля
 *       - Статус має бути одним з: active, completed, cancelled
 *       - tenant_id має існувати в базі даних
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID договору
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractUpdate'
 *           examples:
 *             updatePayment:
 *               summary: Оновити тільки оплату
 *               value:
 *                 monthlyPayment: 15000
 *             updateStatus:
 *               summary: Змінити статус
 *               value:
 *                 status: "completed"
 *             updateDates:
 *               summary: Продовжити договір
 *               value:
 *                 endDate: "2025-12-31"
 *             fullUpdate:
 *               summary: Повне оновлення
 *               value:
 *                 tenant_id: "507f1f77bcf86cd799439012"
 *                 startDate: "2024-02-01"
 *                 endDate: "2024-12-31"
 *                 monthlyPayment: 15000
 *                 status: "active"
 *     responses:
 *       200:
 *         description: Договір успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Договір успішно оновлено"
 *                 contract:
 *                   $ref: '#/components/schemas/Contract'
 *       400:
 *         description: Помилка валідації даних
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidDates:
 *                 summary: Невірні дати
 *                 value:
 *                   message: "Дата початку має бути раніше дати закінчення"
 *               invalidPayment:
 *                 summary: Невірна оплата
 *                 value:
 *                   message: "Місячна оплата має бути більше нуля"
 *               invalidStatus:
 *                 summary: Невірний статус
 *                 value:
 *                   message: "Статус має бути: active, completed або cancelled"
 *       404:
 *         description: Договір або жилець не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               contractNotFound:
 *                 summary: Договір не знайдено
 *                 value:
 *                   message: "Договір не знайдено"
 *               tenantNotFound:
 *                 summary: Жилець не знайдено
 *                 value:
 *                   message: "Жильця з таким tenant_id не знайдено"
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contracts/contract/{id}:
 *   delete:
 *     summary: Видалення договору за ID
 *     description: Повністю видаляє договір з бази даних. Операція незворотна.
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID договору
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Договір успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Договір успішно видалено"
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Невірний формат ID договору"
 *       404:
 *         description: Договір не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Договір не знайдено"
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /contracts/tenant/{tenantId}:
 *   get:
 *     summary: Отримати всі договори конкретного жильця
 *     description: |
 *       Повертає всі договори для конкретного жильця, відсортовані за датою початку (найновіші спочатку).
 *       Включає інформацію про жильця та квартири.
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID жильця
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Список договорів жильця
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantContractsResponse'
 *             example:
 *               tenant:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Іван Петренко"
 *               contracts:
 *                 - _id: "507f1f77bcf86cd799439012"
 *                   tenant_id: "507f1f77bcf86cd799439011"
 *                   startDate: "2024-01-01T00:00:00.000Z"
 *                   endDate: "2024-12-31T00:00:00.000Z"
 *                   monthlyPayment: 12000
 *                   status: "active"
 *                   house:
 *                     apartmentName: "Квартира на Хрещатику"
 *                     street: "вул. Хрещатик, 25"
 *                     floor: 5
 *                 - _id: "507f1f77bcf86cd799439013"
 *                   tenant_id: "507f1f77bcf86cd799439011"
 *                   startDate: "2023-01-01T00:00:00.000Z"
 *                   endDate: "2023-12-31T00:00:00.000Z"
 *                   monthlyPayment: 10000
 *                   status: "completed"
 *                   house:
 *                     apartmentName: "Студія на Подолі"
 *                     street: "вул. Сагайдачного, 10"
 *                     floor: 3
 *               totalContracts: 2
 *       400:
 *         description: Невірний формат ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Невірний формат ID жильця"
 *       404:
 *         description: Жильця не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Жильця не знайдено"
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

