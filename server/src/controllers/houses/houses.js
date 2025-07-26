import { getDB } from '../../config/db.js';
import { ObjectId } from 'mongodb';

// Constants to avoid magic numbers
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_CREATED = 201;
const HTTP_INTERNAL_ERROR = 500;
const MIN_VALUE = 0;
const MIN_PAGE = 1;
const MAX_LIMIT = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const USD_DECIMAL_PLACES = 2;

// 🏠 Створення квартири
const createHouse = async (req, res) => {
  const {
    apartmentName,
    roomsCount,
    totalArea,
    priceUAH,
    usdRate,
    apartmentType,
    floor,
    street,
  } = req.body;

  // Валідація обов'язкових полів
  if (
    !apartmentName ||
    !roomsCount ||
    !totalArea ||
    !priceUAH ||
    !usdRate ||
    !apartmentType ||
    !floor ||
    !street
  ) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: "Всі поля є обов'язковими",
      requiredFields: [
        'apartmentName',
        'roomsCount',
        'totalArea',
        'priceUAH',
        'usdRate',
        'apartmentType',
        'floor',
        'street',
      ],
    });
  }

  // Валідація типу квартири
  if (!['первичка', 'вторична'].includes(apartmentType)) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'Тип квартири має бути "первичка" або "вторична"',
    });
  }

  // Валідація числових значень
  if (
    roomsCount <= MIN_VALUE ||
    totalArea <= MIN_VALUE ||
    priceUAH <= MIN_VALUE ||
    usdRate <= MIN_VALUE ||
    floor <= MIN_VALUE
  ) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'Числові поля мають бути більше нуля',
    });
  }

  const newApartment = {
    apartmentName: apartmentName.trim(),
    roomsCount: parseInt(roomsCount, 10),
    totalArea: parseFloat(totalArea),
    priceUAH: parseFloat(priceUAH),
    usdRate: parseFloat(usdRate),
    priceUSD: parseFloat((priceUAH / usdRate).toFixed(USD_DECIMAL_PLACES)), // Автоматичний розрахунок ціни в доларах
    apartmentType,
    floor: parseInt(floor, 10),
    street: street.trim(),
    createdAt: new Date(),
  };

  try {
    const db = getDB();
    const result = await db.collection('houses').insertOne(newApartment);
    console.warn('Вставлена квартира:', result.insertedId);

    // Повертаємо створену квартиру з ID
    const createdApartment = { ...newApartment, _id: result.insertedId };

    res.status(HTTP_CREATED).json({
      message: 'Квартиру успішно створено',
      apartment: createdApartment,
    });
  } catch (error) {
    console.error('Помилка при створенні квартири:', error);
    res
      .status(HTTP_INTERNAL_ERROR)
      .json({ message: 'Не вдалося зберегти дані.' });
  }
};

// 📋 Отримати всі квартири з пагінацією
const getHouses = async (req, res) => {
  try {
    const db = getDB();

    // Параметри пагінації з query параметрів
    const page = parseInt(req.query.page, 10) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
    const skip = (page - DEFAULT_PAGE) * limit;

    // Валідація параметрів пагінації
    if (page < MIN_PAGE) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ message: 'Номер сторінки має бути більше 0' });
    }

    if (limit < MIN_PAGE || limit > MAX_LIMIT) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ message: 'Ліміт має бути від 1 до 100' });
    }

    // Отримання загальної кількості квартир
    const totalCount = await db.collection('houses').countDocuments();

    // Отримання квартир з пагінацією
    const apartments = await db
      .collection('houses')
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Розрахунок метаданих пагінації
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > MIN_PAGE;

    res.json({
      apartments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error('Помилка при отриманні квартир:', error);
    res
      .status(HTTP_INTERNAL_ERROR)
      .json({ message: 'Не вдалося отримати дані.' });
  }
};

// ❌ Видалення квартири за ID
const deleteHouse = async (req, res) => {
  const apartmentId = req.params.id;

  // Валідація ObjectId
  if (!ObjectId.isValid(apartmentId)) {
    return res
      .status(HTTP_BAD_REQUEST)
      .json({ message: 'Невірний формат ID квартири' });
  }

  try {
    const db = getDB();
    const result = await db
      .collection('houses')
      .deleteOne({ _id: new ObjectId(apartmentId) });

    if (result.deletedCount === MIN_VALUE) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ message: 'Квартиру не знайдено' });
    }

    res.json({ message: 'Квартиру успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні квартири:', error);
    res
      .status(HTTP_INTERNAL_ERROR)
      .json({ message: 'Не вдалося видалити квартиру.' });
  }
};

export { createHouse, getHouses, deleteHouse };
