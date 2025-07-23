/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Ім'я користувача
 *           example: "admin"
 *         password:
 *           type: string
 *           description: Пароль користувача
 *           example: "#1234567890"
 *     Apartment:
 *       type: object
 *       required:
 *         - apartmentName
 *         - roomsCount
 *         - totalArea
 *         - priceUAH
 *         - usdRate
 *         - apartmentType
 *         - floor
 *         - street
 *       properties:
 *         _id:
 *           type: string
 *           description: Унікальний ідентифікатор квартири
 *           example: "507f1f77bcf86cd799439011"
 *         apartmentName:
 *           type: string
 *           description: Назва квартири
 *           example: "Квартира на Хрещатику"
 *         roomsCount:
 *           type: integer
 *           minimum: 1
 *           description: Кількість кімнат
 *           example: 3
 *         totalArea:
 *           type: number
 *           minimum: 0
 *           description: Загальна площа (м²)
 *           example: 85.5
 *         priceUAH:
 *           type: number
 *           minimum: 0
 *           description: Ціна в гривнях
 *           example: 2500000
 *         usdRate:
 *           type: number
 *           minimum: 0
 *           description: Курс долару на момент покупки
 *           example: 37.5
 *         priceUSD:
 *           type: number
 *           description: Ціна в доларах (розраховується автоматично)
 *           example: 66666.67
 *         apartmentType:
 *           type: string
 *           enum: [первичка, вторична]
 *           description: Тип квартири
 *           example: "вторична"
 *         floor:
 *           type: integer
 *           minimum: 1
 *           description: Поверх
 *           example: 5
 *         street:
 *           type: string
 *           description: Вулиця
 *           example: "вул. Хрещатик, 25"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення запису
 *           example: "2025-05-24T13:15:42.702Z"
 *     ApartmentInput:
 *       type: object
 *       required:
 *         - apartmentName
 *         - roomsCount
 *         - totalArea
 *         - priceUAH
 *         - usdRate
 *         - apartmentType
 *         - floor
 *         - street
 *       properties:
 *         apartmentName:
 *           type: string
 *           description: Назва квартири
 *           example: "Квартира на Хрещатику"
 *         roomsCount:
 *           type: integer
 *           minimum: 1
 *           description: Кількість кімнат
 *           example: 3
 *         totalArea:
 *           type: number
 *           minimum: 0
 *           description: Загальна площа (м²)
 *           example: 85.5
 *         priceUAH:
 *           type: number
 *           minimum: 0
 *           description: Ціна в гривнях
 *           example: 2500000
 *         usdRate:
 *           type: number
 *           minimum: 0
 *           description: Курс долару на момент покупки
 *           example: 37.5
 *         apartmentType:
 *           type: string
 *           enum: [первичка, вторична]
 *           description: Тип квартири
 *           example: "вторична"
 *         floor:
 *           type: integer
 *           minimum: 1
 *           description: Поверх
 *           example: 5
 *         street:
 *           type: string
 *           description: Вулиця
 *           example: "вул. Хрещатик, 25"
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           description: Поточна сторінка
 *           example: 1
 *         totalPages:
 *           type: integer
 *           description: Загальна кількість сторінок
 *           example: 5
 *         totalCount:
 *           type: integer
 *           description: Загальна кількість квартир
 *           example: 47
 *         limit:
 *           type: integer
 *           description: Кількість елементів на сторінці
 *           example: 10
 *         hasNextPage:
 *           type: boolean
 *           description: Чи є наступна сторінка
 *           example: true
 *         hasPrevPage:
 *           type: boolean
 *           description: Чи є попередня сторінка
 *           example: false
 *         nextPage:
 *           type: integer
 *           nullable: true
 *           description: Номер наступної сторінки
 *           example: 2
 *         prevPage:
 *           type: integer
 *           nullable: true
 *           description: Номер попередньої сторінки
 *           example: null
 *     ApartmentsResponse:
 *       type: object
 *       properties:
 *         apartments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Apartment'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationInfo'
 *       example:
 *         apartments:
 *           - _id: "507f1f77bcf86cd799439011"
 *             apartmentName: "Квартира на Хрещатику"
 *             roomsCount: 3
 *             totalArea: 85.5
 *             priceUAH: 2500000
 *             usdRate: 37.5
 *             priceUSD: 66666.67
 *             apartmentType: "вторична"
 *             floor: 5
 *             street: "вул. Хрещатик, 25"
 *             createdAt: "2025-05-24T13:15:42.702Z"
 *         pagination:
 *           currentPage: 1
 *           totalPages: 5
 *           totalCount: 47
 *           limit: 10
 *           hasNextPage: true
 *           hasPrevPage: false
 *           nextPage: 2
 *           prevPage: null
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT токен доступу
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: JWT токен оновлення
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh токен для оновлення access токена
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Повідомлення про помилку
 *           example: "Помилка при обробці запиту"
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Повідомлення про успішну операцію
 *           example: "Операція виконана успішно"
 *     Renter:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Унікальний ідентифікатор орендаря
 *           example: "507f1f77bcf86cd799439011"
 *         house_id:
 *           type: string
 *           description: ID квартири
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Ім'я орендаря
 *           example: "Іван Петренко"
 *         start:
 *           type: string
 *           format: date-time
 *           description: Дата заїзду
 *           example: "2024-01-15T00:00:00.000Z"
 *         finish:
 *           type: string
 *           format: date-time
 *           description: Дата виїзду
 *           example: "2024-12-31T00:00:00.000Z"
 *         pricePerMonth:
 *           type: number
 *           description: Ціна за місяць
 *           example: 12000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата створення запису
 *           example: "2025-05-24T13:15:42.702Z"
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
 *     RenterInput:
 *       type: object
 *       required:
 *         - house_id
 *         - name
 *         - start
 *         - pricePerMonth
 *       properties:
 *         house_id:
 *           type: string
 *           description: ID квартири
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Ім'я орендаря
 *           example: "Іван Петренко"
 *         start:
 *           type: string
 *           format: date
 *           description: Дата заїзду
 *           example: "2024-01-15"
 *         finish:
 *           type: string
 *           format: date
 *           description: Дата виїзду (опціонально, якщо не вказано - поточна дата)
 *           example: "2024-12-31"
 *         pricePerMonth:
 *           type: number
 *           minimum: 0
 *           description: Ціна за місяць
 *           example: 12000
 *     RentersResponse:
 *       type: object
 *       properties:
 *         renters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Renter'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationInfo'
 */
