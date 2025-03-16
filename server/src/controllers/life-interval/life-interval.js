const { getDB } = require('../../config/db');
const { ObjectId } = require('mongodb');

// 🏠 Створення будинку
const createHouse = async (req, res) => {
  const newHouse = {
    startDate: req.body.startDate,
    finishDate: req.body.finishDate,
    price: req.body.price,
  };

  try {
    const db = getDB();
    const result = await db.collection('house_boss').insertOne(newHouse);
    console.log('Вставлений документ:', result.insertedId);
    res.json({ message: 'Будинок успішно створено', house: newHouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося зберегти дані.' });
  }
};

// 📋 Отримати всі будинки
const getHouses = async (req, res) => {
  try {
    const db = getDB();
    const houses = await db.collection('house_boss').find().toArray();
    res.json(houses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося отримати дані.' });
  }
};

// ❌ Видалення будинку за ID
const deleteHouse = async (req, res) => {
  const houseId = req.params.id;

  try {
    const db = getDB();
    const result = await db.collection('house_boss').deleteOne({ _id: new ObjectId(houseId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Будинок не знайдено' });
    }

    res.json({ message: 'Будинок успішно видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося видалити будинок.' });
  }
};

// 🔄 Часткове оновлення будинку за ID (PATCH)
const updateHouse = async (req, res) => {
  const houseId = req.params.id;
  const updateFields = req.body;

  try {
    const db = getDB();
    const result = await db.collection('house_boss').updateOne(
      { _id: new ObjectId(houseId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Будинок не знайдено' });
    }

    res.json({ message: 'Будинок успішно оновлено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося оновити будинок.' });
  }
};

module.exports = { createHouse, getHouses, deleteHouse, updateHouse };
