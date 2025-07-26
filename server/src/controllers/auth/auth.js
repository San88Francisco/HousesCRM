import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../../config/db.js';

// Constants to avoid magic numbers
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_CREATED = 201;
const HTTP_INTERNAL_ERROR = 500;
const BCRYPT_SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

// РЕЄСТРАЦІЯ КОРИСТУВАЧА
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = getDB();

    // Перевірка, чи вже є користувач з таким іменем
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ message: "Користувач з таким ім'ям вже існує" });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Додавання користувача в базу даних
    const newUser = { username, password: hashedPassword };
    await db.collection('users').insertOne(newUser);

    res
      .status(HTTP_CREATED)
      .json({ message: 'Користувача успішно зареєстровано' });
  } catch (error) {
    console.error(error);
    res.status(HTTP_INTERNAL_ERROR).json({ message: 'Помилка при реєстрації' });
  }
};

// ЛОГІН КОРИСТУВАЧА
const loginUser = async (req, res) => {
  const { username, password } = req.body; // Або req.query, в залежності від того, як ви передаєте дані

  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ message: "Невірне ім'я користувача або пароль" });
    }

    // Логування отриманих даних
    console.warn('User found: ', user);
    console.warn('Password received: ', password);
    console.warn('Stored password hash: ', user.password);

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ message: "Невірне ім'я користувача або пароль" });
    }

    // Генерація токенів
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    // Збереження Refresh токена
    await db
      .collection('users')
      .updateOne({ _id: user._id }, { $set: { refreshToken } });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Помилка при логіні: ', error);
    res.status(HTTP_INTERNAL_ERROR).json({ message: 'Помилка при логіні' });
  }
};

// ОНОВЛЕННЯ ACCESS ТОКЕНА ЗА ДОПОМОГОЮ REFRESH ТОКЕНА
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ message: 'Токен не знайдений' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const db = getDB();
    const user = await db.collection('users').findOne({ _id: decoded.id });
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ message: 'Невірний Refresh токен' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Помилка при оновленні Access токена: ', error);
    res
      .status(HTTP_INTERNAL_ERROR)
      .json({ message: 'Не вдалося оновити Access токен' });
  }
};

export { registerUser, loginUser, refreshAccessToken };
