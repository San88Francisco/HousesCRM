const { getDB } = require('../../config/db');
const { ObjectId } = require('mongodb');

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
    street
  } = req.body;

  // Валідація обов'язкових полів
  if (!apartmentName || !roomsCount || !totalArea || !priceUAH || !usdRate || !apartmentType || !floor || !street) {
    return res.status(400).json({
      message: 'Всі поля є обов\'язковими',
      requiredFields: [
        'apartmentName', 'roomsCount', 'totalArea',
        'priceUAH', 'usdRate', 'apartmentType', 'floor', 'street'
      ]
    });
  }

  // Валідація типу квартири
  if (!['первичка', 'вторична'].includes(apartmentType)) {
    return res.status(400).json({
      message: 'Тип квартири має бути "первичка" або "вторична"'
    });
  }

  // Валідація числових значень
  if (roomsCount <= 0 || totalArea <= 0 || priceUAH <= 0 || usdRate <= 0 || floor <= 0) {
    return res.status(400).json({
      message: 'Числові поля мають бути більше нуля'
    });
  }

  const newApartment = {
    apartmentName: apartmentName.trim(),
    roomsCount: parseInt(roomsCount),
    totalArea: parseFloat(totalArea),
    priceUAH: parseFloat(priceUAH),
    usdRate: parseFloat(usdRate),
    priceUSD: parseFloat((priceUAH / usdRate).toFixed(2)), // Автоматичний розрахунок ціни в доларах
    apartmentType,
    floor: parseInt(floor),
    street: street.trim(),
    createdAt: new Date()
  };

  try {
    const db = getDB();
    const result = await db.collection('houses').insertOne(newApartment);
    console.log('Вставлена квартира:', result.insertedId);

    // Повертаємо створену квартиру з ID
    const createdApartment = { ...newApartment, _id: result.insertedId };

    res.status(201).json({
      message: 'Квартиру успішно створено',
      apartment: createdApartment
    });
  } catch (error) {
    console.error('Помилка при створенні квартири:', error);
    res.status(500).json({ message: 'Не вдалося зберегти дані.' });
  }
};

// 📋 Отримати всі квартири з пагінацією
const getHouses = async (req, res) => {
  try {
    const db = getDB();

    // Параметри пагінації з query параметрів
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Валідація параметрів пагінації
    if (page < 1) {
      return res.status(400).json({ message: 'Номер сторінки має бути більше 0' });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Ліміт має бути від 1 до 100' });
    }

    // Отримання загальної кількості квартир
    const totalCount = await db.collection('houses').countDocuments();

    // Отримання квартир з пагінацією
    const apartments = await db.collection('houses')
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Розрахунок метаданих пагінації
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

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
        prevPage: hasPrevPage ? page - 1 : null
      }
    });
  } catch (error) {
    console.error('Помилка при отриманні квартир:', error);
    res.status(500).json({ message: 'Не вдалося отримати дані.' });
  }
};

// ❌ Видалення квартири за ID
const deleteHouse = async (req, res) => {
  const apartmentId = req.params.id;

  // Валідація ObjectId
  if (!ObjectId.isValid(apartmentId)) {
    return res.status(400).json({ message: 'Невірний формат ID квартири' });
  }

  try {
    const db = getDB();
    const result = await db.collection('houses').deleteOne({ _id: new ObjectId(apartmentId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Квартиру не знайдено' });
    }

    res.json({ message: 'Квартиру успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні квартири:', error);
    res.status(500).json({ message: 'Не вдалося видалити квартиру.' });
  }
};

module.exports = { createHouse, getHouses, deleteHouse };