-- SQL запит для створення даних для користувача user1@example.com
-- 2 квартири, 4 орендарі, 6 контрактів

-- Перевірка/створення користувача (якщо не існує)
-- Пароль: admin123 (хешований через argon2)
INSERT INTO "user" ("id", "email", "username", "password", "created_at", "updated_at")
VALUES 
  ('3ca5d3be-402e-41c4-ab59-ac856f23d09c', 'user1@example.com', 'user', '$argon2id$v=19$m=65536,t=3,p=4$822tGJ0oAWBdyeLUIvjodA$itF47O6pckkS3A/ZwpjCbtL/KM3gOwRXRGaji2nzTgo', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET 
  "email" = EXCLUDED."email",
  "username" = EXCLUDED."username";

-- Вставка 2 квартир для користувача
INSERT INTO "house" ("id", "apartment_name", "rooms_count", "total_area", "purchase_date", "floor", "street", "apartmentType", "userId", "created_at", "updated_at")
VALUES 
  ('a11e8400-e29b-41d4-a716-446655440001', 'Квартира на Лесі Українки', 2, 48.5, '2020-01-15', 4, 'Вулиця Лесі Українки, 15', 'new_build', '3ca5d3be-402e-41c4-ab59-ac856f23d09c', NOW(), NOW()),
  ('a11e8400-e29b-41d4-a716-446655440002', 'Квартира на Хрещатику', 3, 72.0, '2021-03-20', 7, 'Вулиця Хрещатик, 42', 'resale', '3ca5d3be-402e-41c4-ab59-ac856f23d09c', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Вставка цін для квартир (обов'язково потрібна USD ціна)
INSERT INTO "house_price" ("id", "amount", "exchange_rate", "code", "houseId", "created_at", "updated_at")
VALUES 
  -- Ціни для квартири 1 (Лесі Українки)
  ('b22e8400-e29b-41d4-a716-446655440001', 55000.00, 1.00, 'USD', 'a11e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
  ('b22e8400-e29b-41d4-a716-446655440002', 440000.00, 8.00, 'UAH', 'a11e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
  
  -- Ціни для квартири 2 (Хрещатик)
  ('b22e8400-e29b-41d4-a716-446655440003', 85000.00, 1.00, 'USD', 'a11e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('b22e8400-e29b-41d4-a716-446655440004', 680000.00, 8.00, 'UAH', 'a11e8400-e29b-41d4-a716-446655440002', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Вставка 4 орендарів
INSERT INTO "renter" ("id", "first_name", "last_name", "age", "occupied", "vacated", "created_at", "updated_at")
VALUES 
  ('c33e8400-e29b-41d4-a716-446655440001', 'Олексій', 'Іваненко', 29, '2022-01-01', '2023-06-30', NOW(), NOW()),
  ('c33e8400-e29b-41d4-a716-446655440002', 'Марта', 'Соколова', 31, '2023-07-01', NULL, NOW(), NOW()),
  ('c33e8400-e29b-41d4-a716-446655440003', 'Денис', 'Максименко', 26, '2021-05-15', '2022-12-31', NOW(), NOW()),
  ('c33e8400-e29b-41d4-a716-446655440004', 'Софія', 'Коваль', 28, '2023-01-01', NULL, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Вставка 6 контрактів
INSERT INTO "contract" ("id", "commencement", "termination", "status", "monthly_payment", "houseId", "renterId", "created_at", "updated_at")
VALUES 
  -- Квартира 1 (Лесі Українки) - Олексій Іваненко - 2 контракти
  ('d44e8400-e29b-41d4-a716-446655440001', '2022-01-01', '2022-07-01', 'inactive', 3500, 'a11e8400-e29b-41d4-a716-446655440001', 'c33e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
  ('d44e8400-e29b-41d4-a716-446655440002', '2022-07-01', '2023-06-30', 'inactive', 3700, 'a11e8400-e29b-41d4-a716-446655440001', 'c33e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
  
  -- Квартира 1 (Лесі Українки) - Марта Соколова - 1 контракт (активний)
  ('d44e8400-e29b-41d4-a716-446655440003', '2023-07-01', '2024-06-30', 'active', 3900, 'a11e8400-e29b-41d4-a716-446655440001', 'c33e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  
  -- Квартира 2 (Хрещатик) - Денис Максименко - 2 контракти
  ('d44e8400-e29b-41d4-a716-446655440004', '2021-05-15', '2021-11-15', 'inactive', 4500, 'a11e8400-e29b-41d4-a716-446655440002', 'c33e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
  ('d44e8400-e29b-41d4-a716-446655440005', '2021-11-15', '2022-12-31', 'inactive', 4700, 'a11e8400-e29b-41d4-a716-446655440002', 'c33e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
  
  -- Квартира 2 (Хрещатик) - Софія Коваль - 1 контракт (активний)
  ('d44e8400-e29b-41d4-a716-446655440006', '2023-01-01', '2023-12-31', 'active', 5000, 'a11e8400-e29b-41d4-a716-446655440002', 'c33e8400-e29b-41d4-a716-446655440004', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Перевірка створення даних (виконайте цей запит для перевірки)
-- SELECT id, email, username FROM "user" WHERE email = 'user1@example.com';
-- SELECT id, apartment_name, "userId" FROM "house" WHERE "userId" = '3ca5d3be-402e-41c4-ab59-ac856f23d09c';
-- SELECT id, first_name, last_name FROM "renter";
-- SELECT id, commencement, termination, status, "houseId", "renterId" FROM "contract";
