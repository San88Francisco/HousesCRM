const jwt = require('jsonwebtoken');

// Middleware для перевірки токена
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Необхідна авторизація' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Додаємо інформацію про користувача в запит
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Невірний або застарілий токен' });
  }
};

module.exports = { authenticate };
