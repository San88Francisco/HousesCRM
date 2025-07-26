import jwt from 'jsonwebtoken';

const HTTP_FORBIDDEN = 403;
const HTTP_UNAUTHORIZED = 401;

// Middleware для перевірки токена
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(HTTP_UNAUTHORIZED).json({ message: 'Необхідна авторизація' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Додаємо інформацію про користувача в запит
    next();
  } catch (error) {
    console.error(error);
    res.status(HTTP_FORBIDDEN).json({ message: 'Невірний або застарілий токен' });
  }
};

export { authenticate };
