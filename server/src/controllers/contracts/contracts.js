const { getDB } = require("../../config/db")
const { ObjectId } = require("mongodb")

// Створення договору
const createContract = async (req, res) => {
  const { renter_id, startDate, endDate, monthlyPayment } = req.body

  if (!renter_id || !startDate || !endDate || !monthlyPayment) {
    return res.status(400).json({
      message: "Обов'язкові поля: renter_id, startDate, endDate, monthlyPayment",
      requiredFields: ["renter_id", "startDate", "endDate", "monthlyPayment"],
    })
  }

  if (!ObjectId.isValid(renter_id)) {
    return res.status(400).json({ message: "Невірний формат renter_id" })
  }

  if (monthlyPayment <= 0) {
    return res.status(400).json({
      message: "Місячна оплата має бути більше нуля",
    })
  }

  const start = new Date(startDate)

  let end
  if (endDate === "now") {
    end = "now"
  } else {
    end = new Date(endDate)
    if (start >= end) {
      return res.status(400).json({
        message: "Дата початку має бути раніше дати закінчення",
      })
    }
  }

  try {
    const db = getDB()

    const renter = await db.collection("renters").findOne({ _id: new ObjectId(renter_id) })
    if (!renter) {
      return res.status(404).json({ message: "Орендаря з таким ID не знайдено" })
    }

    const newContract = {
      renter_id: new ObjectId(renter_id),
      startDate: start,
      endDate: end,
      monthlyPayment: Number.parseFloat(monthlyPayment),
      status: "active",
      createdAt: new Date(),
    }

    const result = await db.collection("contracts").insertOne(newContract)

    const createdContract = {
      ...newContract,
      _id: result.insertedId,
      renter: {
        _id: renter._id,
        name: renter.name,
        house_id: renter.house_id,
      },
    }

    res.status(201).json({
      message: "Договір успішно створено",
      contract: createdContract,
    })
  } catch (error) {
    console.error("Помилка при створенні договору:", error)
    res.status(500).json({ message: "Не вдалося зберегти дані." })
  }
}

const calculatePeriodStart = (period) => {
  const now = new Date()
  const periodStart = new Date(now)

  switch (period) {
    case "1month":
      periodStart.setMonth(now.getMonth() - 1)
      periodStart.setHours(0, 0, 0, 0)
      break
    case "6months":
      periodStart.setMonth(now.getMonth() - 6)
      periodStart.setHours(0, 0, 0, 0)
      break
    case "1year":
      periodStart.setFullYear(now.getFullYear() - 1)
      periodStart.setHours(0, 0, 0, 0)
      break
    case "5years":
      periodStart.setFullYear(now.getFullYear() - 5)
      periodStart.setHours(0, 0, 0, 0)
      break
    case "10years":
      periodStart.setFullYear(now.getFullYear() - 10)
      periodStart.setHours(0, 0, 0, 0)
      break
    case "15years":
      periodStart.setFullYear(now.getFullYear() - 15)
      periodStart.setHours(0, 0, 0, 0)
      break
    case "all":
    default:
      return null
  }

  return periodStart
}

// Функція для нормалізації дати (тільки рік, місяць, день)
const normalizeDate = (date) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// Функція для отримання ефективної дати (якщо "now" то поточна дата)
const getEffectiveDate = (dateValue, currentDate = new Date()) => {
  if (dateValue === "now") {
    return currentDate
  }
  return new Date(dateValue)
}

const calculateMonthsBetween = (startDate, endDate) => {
  const start = normalizeDate(startDate)
  const end = normalizeDate(endDate)

  let months = (end.getFullYear() - start.getFullYear()) * 12
  months += end.getMonth() - start.getMonth()

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  return Math.max(1, months)
}

// Функція для розрахунку доходу за період на основі обрізаних дат
const calculateRevenueForContract = (contract, selectedPeriod, now) => {
  if (selectedPeriod === "all") {
    const effectiveEndDate = getEffectiveDate(contract.originalEndDate, now)
    const months = calculateMonthsBetween(contract.originalStartDate, effectiveEndDate)
    const revenue = months * contract.monthlyPayment
    return revenue
  } else {
    const adjustedStart = normalizeDate(contract.adjustedStartDate)
    const adjustedEnd = normalizeDate(contract.adjustedEndDate)
    const months = calculateMonthsBetween(adjustedStart, adjustedEnd)
    const revenue = months * contract.monthlyPayment
    return revenue
  }
}

// Отримати всі договори з фільтрацією по періодах
const getContracts = async (req, res) => {
  try {
    const db = getDB()
    const renter_id = req.query.renter_id
    const period = req.query.period || "all"

    const validPeriods = ["1month", "6months", "1year", "5years", "10years", "15years", "all"]
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        message: "Невірний період. Доступні: 1month, 6months, 1year, 5years, 10years, 15years, all",
      })
    }

    const filter = {}
    if (renter_id) {
      if (!ObjectId.isValid(renter_id)) {
        return res.status(400).json({ message: "Невірний формат renter_id" })
      }
      filter.renter_id = new ObjectId(renter_id)
    }

    const now = new Date()
    const periodStart = calculatePeriodStart(period)
    const periodEnd = now

    // Спочатку отримуємо всі контракти без фільтрації по датах
    const pipeline = []

    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter })
    }

    // Додаємо lookup для renter та house
    pipeline.push(
      {
        $lookup: {
          from: "renters",
          localField: "renter_id",
          foreignField: "_id",
          as: "renter",
        },
      },
      {
        $unwind: {
          path: "$renter",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "houses",
          localField: "renter.house_id",
          foreignField: "_id",
          as: "house",
        },
      },
      {
        $unwind: {
          path: "$house",
          preserveNullAndEmptyArrays: true,
        },
      }
    )

    pipeline.push({
      $project: {
        _id: 1,
        renter_id: 1,
        startDate: 1,
        endDate: 1,
        monthlyPayment: 1,
        status: 1,
        "renter._id": 1,
        "renter.name": 1,
        "renter.house_id": 1,
        "house._id": 1,
        "house.apartmentName": 1,
        "house.street": 1,
        "house.floor": 1,
      },
    })

    const allContracts = await db.collection("contracts").aggregate(pipeline).toArray()

    // Фільтруємо та обробляємо контракти в JavaScript
    const filteredContracts = []

    for (const contract of allContracts) {
      const contractStart = new Date(contract.startDate)
      const contractEnd = getEffectiveDate(contract.endDate, now)

      // Якщо period === "all", включаємо всі контракти
      if (period === "all") {
        filteredContracts.push({
          ...contract,
          originalStartDate: contractStart,
          originalEndDate: contract.endDate,
          adjustedStartDate: contractStart,
          adjustedEndDate: contractEnd,
        })
        continue
      }

      // Перевіряємо чи контракт перетинається з періодом
      const contractOverlaps = contractStart <= periodEnd && contractEnd >= periodStart

      if (!contractOverlaps) {
        // Контракт повністю поза періодом - пропускаємо
        continue
      }

      // Контракт перетинається з періодом - обрізаємо дати
      const adjustedStart = contractStart < periodStart ? periodStart : contractStart
      const adjustedEnd = contractEnd > periodEnd ? periodEnd : contractEnd

      filteredContracts.push({
        ...contract,
        originalStartDate: contractStart,
        originalEndDate: contract.endDate,
        adjustedStartDate: adjustedStart,
        adjustedEndDate: adjustedEnd,
      })
    }

    // Сортуємо за adjustedStartDate
    filteredContracts.sort((a, b) => new Date(b.adjustedStartDate) - new Date(a.adjustedStartDate))

    // Розрахунок статистики
    const totalContracts = filteredContracts.length
    let totalRevenue = 0

    filteredContracts.forEach((contract) => {
      const revenue = calculateRevenueForContract(contract, period, now)
      totalRevenue += revenue
    })

    const averageMonthlyPayment =
      totalContracts > 0
        ? Math.round(filteredContracts.reduce((sum, contract) => sum + contract.monthlyPayment, 0) / totalContracts)
        : 0

    res.json({
      contracts: filteredContracts,
      period: {
        selected: period,
        startDate: periodStart,
        endDate: now,
        description: getPeriodDescription(period),
      },
      statistics: {
        totalContracts,
        totalRevenue: Math.round(totalRevenue),
        averageMonthlyPayment,
      },
    })
  } catch (error) {
    console.error("Помилка при отриманні договорів:", error)
    res.status(500).json({ message: "Не вдалося отримати дані." })
  }
}

const getPeriodDescription = (period) => {
  const descriptions = {
    "1month": "За останній місяць",
    "6months": "За останні 6 місяців",
    "1year": "За останній рік",
    "5years": "За останні 5 років",
    "10years": "За останні 10 років",
    "15years": "За останні 15 років",
    all: "За весь час",
  }
  return descriptions[period] || "Невідомий період"
}

// Отримати договір за ID
const getContractById = async (req, res) => {
  const contractId = req.params.id

  if (!ObjectId.isValid(contractId)) {
    return res.status(400).json({ message: "Невірний формат ID договору" })
  }

  try {
    const db = getDB()

    const contractExists = await db.collection("contracts").findOne({ _id: new ObjectId(contractId) })

    if (!contractExists) {
      return res.status(404).json({ message: "Договір не знайдено" })
    }

    const contract = await db
      .collection("contracts")
      .aggregate([
        { $match: { _id: new ObjectId(contractId) } },
        {
          $lookup: {
            from: "renters",
            localField: "renter_id",
            foreignField: "_id",
            as: "renter",
          },
        },
        {
          $unwind: {
            path: "$renter",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "houses",
            localField: "renter.house_id",
            foreignField: "_id",
            as: "house",
          },
        },
        {
          $unwind: {
            path: "$house",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            renter_id: 1,
            startDate: 1,
            endDate: 1,
            monthlyPayment: 1,
            status: 1,
            createdAt: 1,
            "renter._id": 1,
            "renter.name": 1,
            "renter.house_id": 1,
            "house._id": 1,
            "house.apartmentName": 1,
            "house.street": 1,
            "house.floor": 1,
            "house.roomsCount": 1,
          },
        },
      ])
      .toArray()

    if (contract.length === 0) {
      res.json({ contract: contractExists })
    } else {
      res.json({ contract: contract[0] })
    }
  } catch (error) {
    console.error("Помилка при отриманні договору:", error)
    res.status(500).json({ message: "Не вдалося отримати дані." })
  }
}

// Оновлення договору за ID
const updateContract = async (req, res) => {
  const contractId = req.params.id
  const updateFields = req.body

  if (!ObjectId.isValid(contractId)) {
    return res.status(400).json({ message: "Невірний формат ID договору" })
  }

  if (updateFields.renter_id && !ObjectId.isValid(updateFields.renter_id)) {
    return res.status(400).json({ message: "Невірний формат renter_id" })
  }

  if (updateFields.monthlyPayment !== undefined && updateFields.monthlyPayment <= 0) {
    return res.status(400).json({
      message: "Місячна оплата має бути більше нуля",
    })
  }

  if (updateFields.startDate && updateFields.endDate && updateFields.endDate !== "now") {
    const start = new Date(updateFields.startDate)
    const end = new Date(updateFields.endDate)

    if (start >= end) {
      return res.status(400).json({
        message: "Дата початку має бути раніше дати закінчення",
      })
    }
  }

  if (updateFields.status && !["active", "completed", "cancelled"].includes(updateFields.status)) {
    return res.status(400).json({
      message: "Статус має бути: active, completed або cancelled",
    })
  }

  try {
    const db = getDB()

    const existingContract = await db.collection("contracts").findOne({ _id: new ObjectId(contractId) })
    if (!existingContract) {
      return res.status(404).json({ message: "Договір не знайдено" })
    }

    if (updateFields.renter_id) {
      const renter = await db.collection("renters").findOne({ _id: new ObjectId(updateFields.renter_id) })
      if (!renter) {
        return res.status(404).json({ message: "Орендаря з таким renter_id не знайдено" })
      }
      updateFields.renter_id = new ObjectId(updateFields.renter_id)
    }

    const fieldsToUpdate = { ...updateFields }

    if (fieldsToUpdate.monthlyPayment) fieldsToUpdate.monthlyPayment = Number.parseFloat(fieldsToUpdate.monthlyPayment)
    if (fieldsToUpdate.startDate) fieldsToUpdate.startDate = new Date(fieldsToUpdate.startDate)
    if (fieldsToUpdate.endDate && fieldsToUpdate.endDate !== "now")
      fieldsToUpdate.endDate = new Date(fieldsToUpdate.endDate)

    fieldsToUpdate.updatedAt = new Date()

    const result = await db
      .collection("contracts")
      .updateOne({ _id: new ObjectId(contractId) }, { $set: fieldsToUpdate })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Договір не знайдено" })
    }

    const updatedContract = await db.collection("contracts").findOne({ _id: new ObjectId(contractId) })

    res.json({
      message: "Договір успішно оновлено",
      contract: updatedContract,
    })
  } catch (error) {
    console.error("Помилка при оновленні договору:", error)
    res.status(500).json({ message: "Не вдалося оновити договір." })
  }
}

// Видалення договору за ID
const deleteContract = async (req, res) => {
  const contractId = req.params.id

  if (!ObjectId.isValid(contractId)) {
    return res.status(400).json({ message: "Невірний формат ID договору" })
  }

  try {
    const db = getDB()
    const result = await db.collection("contracts").deleteOne({ _id: new ObjectId(contractId) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Договір не знайдено" })
    }

    res.json({ message: "Договір успішно видалено" })
  } catch (error) {
    console.error("Помилка при видаленні договору:", error)
    res.status(500).json({ message: "Не вдалося видалити договір." })
  }
}

// Отримати договори по орендарю
const getContractsByRenter = async (req, res) => {
  const renterId = req.params.renterId

  if (!ObjectId.isValid(renterId)) {
    return res.status(400).json({ message: "Невірний формат ID орендаря" })
  }

  try {
    const db = getDB()

    const renter = await db.collection("renters").findOne({ _id: new ObjectId(renterId) })
    if (!renter) {
      return res.status(404).json({ message: "Орендаря не знайдено" })
    }

    const contracts = await db
      .collection("contracts")
      .aggregate([
        { $match: { renter_id: new ObjectId(renterId) } },
        {
          $lookup: {
            from: "renters",
            localField: "renter_id",
            foreignField: "_id",
            as: "renter",
          },
        },
        {
          $unwind: {
            path: "$renter",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "houses",
            localField: "renter.house_id",
            foreignField: "_id",
            as: "house",
          },
        },
        {
          $unwind: {
            path: "$house",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { startDate: -1 } },
      ])
      .toArray()

    res.json({
      renter: {
        _id: renter._id,
        name: renter.name,
      },
      contracts,
      totalContracts: contracts.length,
    })
  } catch (error) {
    console.error("Помилка при отриманні договорів орендаря:", error)
    res.status(500).json({ message: "Не вдалося отримати дані." })
  }
}

module.exports = {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  getContractsByRenter,
}