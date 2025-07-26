import { ObjectId } from 'mongodb';
import { DEFAULTS } from '../../constants/defaults.js';
import { VALIDATION } from '../../constants/validation.js';

export const createRenterObject = (data) => {
  const { house_id, name, start, finish, pricePerMonth } = data;

  return {
    house_id: new ObjectId(house_id),
    name: name.trim(),
    start: new Date(start),
    finish: finish ? new Date(finish) : new Date(),
    pricePerMonth: parseFloat(pricePerMonth),
    createdAt: new Date(),
  };
};

export const prepareUpdateFields = (updateFields) => {
  const fieldsToUpdate = { ...updateFields };

  // Конвертація house_id
  if (fieldsToUpdate.house_id) {
    fieldsToUpdate.house_id = new ObjectId(fieldsToUpdate.house_id);
  }

  // Конвертація типів даних
  if (fieldsToUpdate.pricePerMonth) {
    fieldsToUpdate.pricePerMonth = parseFloat(fieldsToUpdate.pricePerMonth);
  }
  if (fieldsToUpdate.start) {
    fieldsToUpdate.start = new Date(fieldsToUpdate.start);
  }
  if (fieldsToUpdate.finish) {
    fieldsToUpdate.finish = new Date(fieldsToUpdate.finish);
  }
  if (fieldsToUpdate.name) {
    fieldsToUpdate.name = fieldsToUpdate.name.trim();
  }

  // Додаємо час оновлення
  fieldsToUpdate.updatedAt = new Date();

  return fieldsToUpdate;
};

export const buildFilter = (house_id) => {
  const filter = {};
  if (house_id) {
    filter.house_id = new ObjectId(house_id);
  }
  return filter;
};

export const calculatePaginationMeta = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > VALIDATION.MIN_PAGE;

  return {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + DEFAULTS.PAGE : null,
    prevPage: hasPrevPage ? page - DEFAULTS.PAGE : null,
  };
};

export const createRenterResponse = (newRenter, insertedId, house) => {
  return {
    ...newRenter,
    _id: insertedId,
    house: {
      _id: house._id,
      apartmentName: house.apartmentName,
      street: house.street,
    },
  };
};