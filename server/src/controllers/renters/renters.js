const { getDB } = require('../../config/db');
const { ObjectId } = require('mongodb');

// 👤 Створення жильця
const createTenant = async (req, res) => {
  const {
    house_id,
    name,
    start,
    finish,
    pricePerMonth
  } = req.body;

  // Валідація обов'язкових полів
  if (!house_id || !name || !start || !pricePerMonth) {
    return res.status(400).json({
      message: 'Обов\'язкові поля: house_id, name, start, pricePerMonth',
      requiredFields: ['house_id', 'name', 'start', 'pricePerMonth']
    });
  }

  // Валідація ObjectId для house_id
  if (!ObjectId.isValid(house_id)) {
    return res.status(400).json({ message: 'Невірний формат house_id' });
  }

  // Валідація числових значень
  if (pricePerMonth <= 0) {
    return res.status(400).json({
      message: 'Ціна за місяць має бути більше нуля'
    });
  }

  try {
    const db = getDB();

    // Перевірка чи існує квартира з таким ID
    const house = await db.collection('houses').findOne({ _id: new ObjectId(house_id) });
    if (!house) {
      return res.status(404).json({ message: 'Квартиру з таким ID не знайдено' });
    }

    const newTenant = {
      house_id: new ObjectId(house_id),
      name: name.trim(),
      start: new Date(start),
      finish: finish ? new Date(finish) : new Date(), // Якщо finish не передано, ставимо поточну дату
      pricePerMonth: parseFloat(pricePerMonth),
      createdAt: new Date()
    };

    const result = await db.collection('tenants').insertOne(newTenant);
    console.log('Вставлений жилець:', result.insertedId);

    // Повертаємо створеного жильця з ID та інформацією про квартиру
    const createdTenant = {
      ...newTenant,
      _id: result.insertedId,
      house: {
        _id: house._id,
        apartmentName: house.apartmentName,
        street: house.street
      }
    };

    res.status(201).json({
      message: 'Жильця успішно створено',
      tenant: createdTenant
    });
  } catch (error) {
    console.error('Помилка при створенні жильця:', error);
    res.status(500).json({ message: 'Не вдалося зберегти дані.' });
  }
};

// 📋 Отримати всіх жильців з пагінацією
const getTenants = async (req, res) => {
  try {
    const db = getDB();

    // Параметри пагінації з query параметрів
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const house_id = req.query.house_id; // Фільтр по квартирі (опціонально)

    // Валідація параметрів пагінації
    if (page < 1) {
      return res.status(400).json({ message: 'Номер сторінки має бути більше 0' });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Ліміт має бути від 1 до 100' });
    }

    // Створення фільтру
    let filter = {};
    if (house_id) {
      if (!ObjectId.isValid(house_id)) {
        return res.status(400).json({ message: 'Невірний формат house_id' });
      }
      filter.house_id = new ObjectId(house_id);
    }

    // Отримання загальної кількості жильців
    const totalCount = await db.collection('tenants').countDocuments(filter);

    // Отримання жильців з пагінацією та інформацією про квартири
    const tenants = await db.collection('tenants').aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'houses',
          localField: 'house_id',
          foreignField: '_id',
          as: 'house'
        }
      },
      { $unwind: '$house' },
      {
        $project: {
          _id: 1,
          house_id: 1,
          name: 1,
          start: 1,
          finish: 1,
          pricePerMonth: 1,
          createdAt: 1,
          'house._id': 1,
          'house.apartmentName': 1,
          'house.street': 1,
          'house.floor': 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).toArray();

    // Розрахунок метаданих пагінації
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      tenants,
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
    console.error('Помилка при отриманні жильців:', error);
    res.status(500).json({ message: 'Не вдалося отримати дані.' });
  }
};

// 👁️ Отримати жильця за ID
const getTenantById = async (req, res) => {
  const tenantId = req.params.id;

  // Валідація ObjectId
  if (!ObjectId.isValid(tenantId)) {
    return res.status(400).json({ message: 'Невірний формат ID жильця' });
  }

  try {
    const db = getDB();

    const tenant = await db.collection('tenants').aggregate([
      { $match: { _id: new ObjectId(tenantId) } },
      {
        $lookup: {
          from: 'houses',
          localField: 'house_id',
          foreignField: '_id',
          as: 'house'
        }
      },
      { $unwind: '$house' },
      {
        $project: {
          _id: 1,
          house_id: 1,
          name: 1,
          start: 1,
          finish: 1,
          pricePerMonth: 1,
          createdAt: 1,
          'house._id': 1,
          'house.apartmentName': 1,
          'house.street': 1,
          'house.floor': 1,
          'house.roomsCount': 1
        }
      }
    ]).toArray();

    if (tenant.length === 0) {
      return res.status(404).json({ message: 'Жильця не знайдено' });
    }

    res.json({ tenant: tenant[0] });
  } catch (error) {
    console.error('Помилка при отриманні жильця:', error);
    res.status(500).json({ message: 'Не вдалося отримати дані.' });
  }
};

// 🔄 Оновлення жильця за ID (PATCH)
const updateTenant = async (req, res) => {
  const tenantId = req.params.id;
  const updateFields = req.body;

  // Валідація ObjectId
  if (!ObjectId.isValid(tenantId)) {
    return res.status(400).json({ message: 'Невірний формат ID жильця' });
  }

  // Валідація house_id, якщо він передається
  if (updateFields.house_id && !ObjectId.isValid(updateFields.house_id)) {
    return res.status(400).json({ message: 'Невірний формат house_id' });
  }

  // Валідація числових значень, якщо вони передаються
  if (updateFields.pricePerMonth !== undefined && updateFields.pricePerMonth <= 0) {
    return res.status(400).json({
      message: 'Ціна за місяць має бути більше нуля'
    });
  }

  try {
    const db = getDB();

    // Перевірка чи існує жилець
    const existingTenant = await db.collection('tenants').findOne({ _id: new ObjectId(tenantId) });
    if (!existingTenant) {
      return res.status(404).json({ message: 'Жильця не знайдено' });
    }

    // Якщо оновлюється house_id, перевіряємо чи існує така квартира
    if (updateFields.house_id) {
      const house = await db.collection('houses').findOne({ _id: new ObjectId(updateFields.house_id) });
      if (!house) {
        return res.status(404).json({ message: 'Квартиру з таким house_id не знайдено' });
      }
      updateFields.house_id = new ObjectId(updateFields.house_id);
    }

    // Підготовка полів для оновлення
    const fieldsToUpdate = { ...updateFields };

    // Конвертація типів даних
    if (fieldsToUpdate.pricePerMonth) fieldsToUpdate.pricePerMonth = parseFloat(fieldsToUpdate.pricePerMonth);
    if (fieldsToUpdate.start) fieldsToUpdate.start = new Date(fieldsToUpdate.start);
    if (fieldsToUpdate.finish) fieldsToUpdate.finish = new Date(fieldsToUpdate.finish);
    if (fieldsToUpdate.name) fieldsToUpdate.name = fieldsToUpdate.name.trim();

    // Додаємо час оновлення
    fieldsToUpdate.updatedAt = new Date();

    const result = await db.collection('tenants').updateOne(
      { _id: new ObjectId(tenantId) },
      { $set: fieldsToUpdate }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Жильця не знайдено' });
    }

    // Отримуємо оновленого жильця з інформацією про квартиру
    const updatedTenant = await db.collection('tenants').aggregate([
      { $match: { _id: new ObjectId(tenantId) } },
      {
        $lookup: {
          from: 'houses',
          localField: 'house_id',
          foreignField: '_id',
          as: 'house'
        }
      },
      { $unwind: '$house' }
    ]).toArray();

    res.json({
      message: 'Жильця успішно оновлено',
      tenant: updatedTenant[0]
    });
  } catch (error) {
    console.error('Помилка при оновленні жильця:', error);
    res.status(500).json({ message: 'Не вдалося оновити жильця.' });
  }
};

// ❌ Видалення жильця за ID
const deleteTenant = async (req, res) => {
  const tenantId = req.params.id;

  // Валідація ObjectId
  if (!ObjectId.isValid(tenantId)) {
    return res.status(400).json({ message: 'Невірний формат ID жильця' });
  }

  try {
    const db = getDB();
    const result = await db.collection('tenants').deleteOne({ _id: new ObjectId(tenantId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Жильця не знайдено' });
    }

    res.json({ message: 'Жильця успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні жильця:', error);
    res.status(500).json({ message: 'Не вдалося видалити жильця.' });
  }
};

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant
};