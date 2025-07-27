// dbOperations.js
import { ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';

export const findHouseById = async (houseId) => {
  const db = getDB();
  return await db.collection('houses').findOne({ _id: new ObjectId(houseId) });
};

export const insertRenter = async (renterData) => {
  const db = getDB();
  return await db.collection('renters').insertOne(renterData);
};

export const countRenters = async (filter) => {
  const db = getDB();
  return await db.collection('renters').countDocuments(filter);
};

export const findRentersWithPagination = async (filter, skip, limit) => {
  const db = getDB();
  return await db
    .collection('renters')
    .aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'houses',
          localField: 'house_id',
          foreignField: '_id',
          as: 'house',
        },
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
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])
    .toArray();
};

export const findRenterById = async (renterId) => {
  const db = getDB();
  return await db
    .collection('renters')
    .aggregate([
      { $match: { _id: new ObjectId(renterId) } },
      {
        $lookup: {
          from: 'houses',
          localField: 'house_id',
          foreignField: '_id',
          as: 'house',
        },
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
          'house.roomsCount': 1,
        },
      },
    ])
    .toArray();
};

export const checkRenterExists = async (renterId) => {
  const db = getDB();
  return await db
    .collection('renters')
    .findOne({ _id: new ObjectId(renterId) });
};

export const updateRenterById = async (renterId, updateFields) => {
  const db = getDB();
  return await db
    .collection('renters')
    .updateOne({ _id: new ObjectId(renterId) }, { $set: updateFields });
};

export const getUpdatedRenterWithHouse = async (renterId) => {
  const db = getDB();
  return await db
    .collection('renters')
    .aggregate([
      { $match: { _id: new ObjectId(renterId) } },
      {
        $lookup: {
          from: 'houses',
          localField: 'house_id',
          foreignField: '_id',
          as: 'house',
        },
      },
      { $unwind: '$house' },
    ])
    .toArray();
};

export const deleteRenterById = async (renterId) => {
  const db = getDB();
  return await db
    .collection('renters')
    .deleteOne({ _id: new ObjectId(renterId) });
};
