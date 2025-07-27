import {
  validateObjectId,
  validateCreateRenterData,
  validatePaginationParams,
  validateUpdateData,
} from './validation.js';
import {
  createRenterObject,
  prepareUpdateFields,
  buildFilter,
  calculatePaginationMeta,
  createRenterResponse,
} from '../../utils/renters/utils.js';
import {
  findHouseById,
  insertRenter,
  countRenters,
  findRentersWithPagination,
  findRenterById,
  checkRenterExists,
  updateRenterById,
  getUpdatedRenterWithHouse,
  deleteRenterById,
} from './dbOperations.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { VALIDATION } from '../../constants/validation.js';
import { DEFAULTS } from '../../constants/defaults.js';

// 👤 Створення орендаря
const createRenter = async (req, res) => {
  const { house_id, name, start, finish, pricePerMonth } = req.body;

  // Валідація даних
  const validation = validateCreateRenterData({
    house_id,
    name,
    start,
    pricePerMonth,
  });
  if (!validation.isValid) {
    return res.status(validation.error.status).json(validation.error);
  }

  try {
    // Перевірка чи існує квартира
    const house = await findHouseById(house_id);
    if (!house) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Квартиру з таким ID не знайдено' });
    }

    // Створення нового орендаря
    const newRenter = createRenterObject({
      house_id,
      name,
      start,
      finish,
      pricePerMonth,
    });
    const result = await insertRenter(newRenter);

    console.warn('Вставлений орендар:', result.insertedId);

    // Формування відповіді
    const createdRenter = createRenterResponse(
      newRenter,
      result.insertedId,
      house
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Орендаря успішно створено',
      renter: createdRenter,
    });
  } catch (error) {
    console.error('Помилка при створенні орендаря:', error);
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ message: 'Не вдалося зберегти дані.' });
  }
};

// 📋 Отримати всіх орендарів з пагінацією
const getRenters = async (req, res) => {
  try {
    // Параметри пагінації
    const page = parseInt(req.query.page, 10) || DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit, 10) || DEFAULTS.LIMIT;
    const skip = (page - DEFAULTS.PAGE) * limit;
    const house_id = req.query.house_id;

    // Валідація параметрів пагінації
    const paginationValidation = validatePaginationParams(page, limit);
    if (!paginationValidation.isValid) {
      return res
        .status(paginationValidation.error.status)
        .json(paginationValidation.error);
    }

    // Валідація house_id, якщо передано
    if (house_id) {
      const houseIdValidation = validateObjectId(house_id, 'house_id');
      if (!houseIdValidation.isValid) {
        return res
          .status(houseIdValidation.error.status)
          .json(houseIdValidation.error);
      }
    }

    // Створення фільтру
    const filter = buildFilter(house_id);

    // Отримання даних
    const totalCount = await countRenters(filter);
    const renters = await findRentersWithPagination(filter, skip, limit);

    // Розрахунок метаданих пагінації
    const pagination = calculatePaginationMeta(page, limit, totalCount);

    res.json({ renters, pagination });
  } catch (error) {
    console.error('Помилка при отриманні орендарів:', error);
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ message: 'Не вдалося отримати дані.' });
  }
};

// 👁️ Отримати орендаря за ID
const getRenterById = async (req, res) => {
  const renterId = req.params.id;

  // Валідація ObjectId
  const validation = validateObjectId(renterId, 'ID орендаря');
  if (!validation.isValid) {
    return res.status(validation.error.status).json(validation.error);
  }

  try {
    const renter = await findRenterById(renterId);

    if (renter.length === VALIDATION.MIN_VALUE) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Орендаря не знайдено' });
    }

    res.json({ renter: renter[0] });
  } catch (error) {
    console.error('Помилка при отриманні орендаря:', error);
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ message: 'Не вдалося отримати дані.' });
  }
};

// 🔄 Оновлення орендаря за ID (PATCH)
const updateRenter = async (req, res) => {
  const renterId = req.params.id;
  const updateFields = req.body;

  // Валідація ID орендаря
  const idValidation = validateObjectId(renterId, 'ID орендаря');
  if (!idValidation.isValid) {
    return res.status(idValidation.error.status).json(idValidation.error);
  }

  // Валідація даних для оновлення
  const dataValidation = validateUpdateData(updateFields);
  if (!dataValidation.isValid) {
    return res.status(dataValidation.error.status).json(dataValidation.error);
  }

  try {
    // Перевірка чи існує орендар
    const existingRenter = await checkRenterExists(renterId);
    if (!existingRenter) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Орендаря не знайдено' });
    }

    // Якщо оновлюється house_id, перевіряємо чи існує така квартира
    if (updateFields.house_id) {
      const house = await findHouseById(updateFields.house_id);
      if (!house) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'Квартиру з таким house_id не знайдено' });
      }
    }

    // Підготовка полів для оновлення
    const fieldsToUpdate = prepareUpdateFields(updateFields);

    // Оновлення орендаря
    const result = await updateRenterById(renterId, fieldsToUpdate);

    if (result.matchedCount === VALIDATION.MIN_VALUE) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Орендаря не знайдено' });
    }

    // Отримуємо оновленого орендаря
    const updatedRenter = await getUpdatedRenterWithHouse(renterId);

    res.json({
      message: 'Орендаря успішно оновлено',
      renter: updatedRenter[0],
    });
  } catch (error) {
    console.error('Помилка при оновленні орендаря:', error);
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ message: 'Не вдалося оновити орендаря.' });
  }
};

// ❌ Видалення орендаря за ID
const deleteRenter = async (req, res) => {
  const renterId = req.params.id;

  // Валідація ObjectId
  const validation = validateObjectId(renterId, 'ID орендаря');
  if (!validation.isValid) {
    return res.status(validation.error.status).json(validation.error);
  }

  try {
    const result = await deleteRenterById(renterId);

    if (result.deletedCount === VALIDATION.MIN_VALUE) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Орендаря не знайдено' });
    }

    res.json({ message: 'Орендаря успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні орендаря:', error);
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ message: 'Не вдалося видалити орендаря.' });
  }
};

export { createRenter, getRenters, getRenterById, updateRenter, deleteRenter };
