const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../../config/db');

// РЕЄСТРАЦІЯ КОРИСТУВАЧА
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = getDB();

    // Перевірка, чи вже є користувач з таким іменем
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким ім\'ям вже існує' });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Додавання користувача в базу даних
    const newUser = { username, password: hashedPassword };
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: 'Користувача успішно зареєстровано' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при реєстрації' });
  }
};

// ЛОГІН КОРИСТУВАЧА
const loginUser = async (req, res) => {
  const { username, password } = req.body;  // Або req.query, в залежності від того, як ви передаєте дані

  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Невірне ім'я користувача або пароль" });
    }

    // Логування отриманих даних
    console.log("User found: ", user);
    console.log("Password received: ", password);
    console.log("Stored password hash: ", user.password);

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Невірне ім'я користувача або пароль" });
    }

    // Генерація токенів
    const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Збереження Refresh токена
    await db.collection('users').updateOne({ _id: user._id }, { $set: { refreshToken } });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Помилка при логіні: ", error);
    res.status(500).json({ message: 'Помилка при логіні' });
  }
};

// ОНОВЛЕННЯ ACCESS ТОКЕНА ЗА ДОПОМОГОЮ REFRESH ТОКЕНА
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: 'Токен не знайдений' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const db = getDB();
    const user = await db.collection('users').findOne({ _id: decoded.id });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Невірний Refresh токен' });
    }

    const newAccessToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Помилка при оновленні Access токена: ", error);
    res.status(500).json({ message: 'Не вдалося оновити Access токен' });
  }
};

module.exports = { registerUser, loginUser, refreshAccessToken };
