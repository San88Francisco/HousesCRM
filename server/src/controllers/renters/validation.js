import { ObjectId } from 'mongodb';
import { VALIDATION } from '../../constants/validation.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

export const validateObjectId = (id, fieldName = 'ID') => {
  if (!ObjectId.isValid(id)) {
    return {
      isValid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: `Невірний формат ${fieldName}`
      }
    };
  }
  return { isValid: true };
};

export const validateCreateRenterData = ({ house_id, name, start, pricePerMonth }) => {
  // Перевірка обов'язкових полів
  if (!house_id || !name || !start || !pricePerMonth) {
    return {
      isValid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Обов'язкові поля: house_id, name, start, pricePerMonth",
        requiredFields: ['house_id', 'name', 'start', 'pricePerMonth']
      }
    };
  }

  // Валідація house_id
  const houseIdValidation = validateObjectId(house_id, 'house_id');
  if (!houseIdValidation.isValid) {
    return houseIdValidation;
  }

  // Валідація ціни
  if (pricePerMonth <= VALIDATION.MIN_VALUE) {
    return {
      isValid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Ціна за місяць має бути більше нуля'
      }
    };
  }

  return { isValid: true };
};

export const validatePaginationParams = (page, limit) => {
  if (page < VALIDATION.MIN_PAGE) {
    return {
      isValid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Номер сторінки має бути більше 0'
      }
    };
  }

  if (limit < VALIDATION.MIN_PAGE || limit > VALIDATION.MAX_LIMIT) {
    return {
      isValid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Ліміт має бути від 1 до 100'
      }
    };
  }

  return { isValid: true };
};

export const validateUpdateData = (updateFields) => {
  // Валідація house_id, якщо він передається
  if (updateFields.house_id) {
    const houseIdValidation = validateObjectId(updateFields.house_id, 'house_id');
    if (!houseIdValidation.isValid) {
      return houseIdValidation;
    }
  }

  // Валідація ціни, якщо вона передається
  if (updateFields.pricePerMonth !== undefined && updateFields.pricePerMonth <= VALIDATION.MIN_VALUE) {
    return {
      isValid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Ціна за місяць має бути більше нуля'
      }
    };
  }

  return { isValid: true };
};