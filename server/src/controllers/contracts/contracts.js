const { getDB } = require("../../config/db")
const { ObjectId } = require("mongodb")

// Створення договору
const createContract = async (req, res) => {
  const { tenant_id, startDate, endDate, monthlyPayment } = req.body

  if (!tenant_id || !startDate || !endDate || !monthlyPayment) {
    return res.status(400).json({
      message: "Обов'язкові поля: tenant_id, startDate, endDate, monthlyPayment",
      requiredFields: ["tenant_id", "startDate", "endDate", "monthlyPayment"],
    })
  }

  if (!ObjectId.isValid(tenant_id)) {
    return res.status(400).json({ message: "Невірний формат tenant_id" })
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

    const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(tenant_id) })
    if (!tenant) {
      return res.status(404).json({ message: "Жильця з таким ID не знайдено" })
    }

    const newContract = {
      tenant_id: new ObjectId(tenant_id),
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
      tenant: {
        _id: tenant._id,
        name: tenant.name,
        house_id: tenant.house_id,
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
  }
  else {
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
    const tenant_id = req.query.tenant_id
    const period = req.query.period || "all"

    const validPeriods = ["1month", "6months", "1year", "5years", "10years", "15years", "all"]
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        message: "Невірний період. Доступні: 1month, 6months, 1year, 5years, 10years, 15years, all",
      })
    }

    const filter = {}
    if (tenant_id) {
      if (!ObjectId.isValid(tenant_id)) {
        return res.status(400).json({ message: "Невірний формат tenant_id" })
      }
      filter.tenant_id = new ObjectId(tenant_id)
    }

    const now = new Date()
    const periodStart = calculatePeriodStart(period)





    const pipeline = []

    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter })
    }

    if (periodStart) {
      const periodFilter = {
        $or: [
          {
            startDate: { $gte: periodStart },
            startDate: { $lte: now },
          },
          {
            $and: [
              { endDate: { $ne: "now" } },
              { endDate: { $gte: periodStart } },
              { endDate: { $lte: now } },
            ],
          },
          {
            startDate: { $lte: periodStart },
            $or: [
              { endDate: { $gte: now } },
              { endDate: "now" },
            ],
          },

          {
            $and: [
              { startDate: { $lte: now } },
              {
                $or: [
                  { endDate: { $gte: periodStart } },
                  { endDate: "now" },
                ],
              },
            ],
          },
        ],
      }

      pipeline.push({ $match: periodFilter })
    }

    // Обрізання дат для відображення
    pipeline.push({
      $addFields: {
        originalStartDate: "$startDate",
        originalEndDate: "$endDate",
        adjustedStartDate: {
          $cond: {
            if: periodStart ? { $lt: ["$startDate", periodStart] } : false,
            then: periodStart,
            else: "$startDate",
          },
        },
        adjustedEndDate: {
          $cond: {

            if: { $eq: ["$endDate", "now"] },
            then: now,
            else: {
              $cond: {
                if: { $gt: ["$endDate", now] },
                then: now,
                else: "$endDate",
              },
            },
          },
        },
      },
    })


    pipeline.push(
      {
        $lookup: {
          from: "tenants",
          localField: "tenant_id",
          foreignField: "_id",
          as: "tenant",
        },
      },
      {
        $unwind: {
          path: "$tenant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "houses",
          localField: "tenant.house_id",
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
    )

    pipeline.push({
      $project: {
        _id: 1,
        tenant_id: 1,
        originalStartDate: 1,
        originalEndDate: 1,
        adjustedStartDate: 1,
        adjustedEndDate: 1,
        monthlyPayment: 1,
        status: 1,
        "tenant._id": 1,
        "tenant.name": 1,
        "tenant.house_id": 1,
        "house._id": 1,
        "house.apartmentName": 1,
        "house.street": 1,
        "house.floor": 1,
      },
    })

    pipeline.push({ $sort: { adjustedStartDate: -1 } })

    const contracts = await db.collection("contracts").aggregate(pipeline).toArray()

    // Розрахунок статистики
    const totalContracts = contracts.length
    let totalRevenue = 0



    contracts.forEach((contract, index) => {


      const revenue = calculateRevenueForContract(contract, period, now)
      totalRevenue += revenue
    })



    const averageMonthlyPayment =
      totalContracts > 0
        ? Math.round(contracts.reduce((sum, contract) => sum + contract.monthlyPayment, 0) / totalContracts)
        : 0

    res.json({
      contracts,
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
            from: "tenants",
            localField: "tenant_id",
            foreignField: "_id",
            as: "tenant",
          },
        },
        {
          $unwind: {
            path: "$tenant",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "houses",
            localField: "tenant.house_id",
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
            tenant_id: 1,
            startDate: 1,
            endDate: 1,
            monthlyPayment: 1,
            status: 1,
            createdAt: 1,
            "tenant._id": 1,
            "tenant.name": 1,
            "tenant.house_id": 1,
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

  if (updateFields.tenant_id && !ObjectId.isValid(updateFields.tenant_id)) {
    return res.status(400).json({ message: "Невірний формат tenant_id" })
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

    if (updateFields.tenant_id) {
      const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(updateFields.tenant_id) })
      if (!tenant) {
        return res.status(404).json({ message: "Жильця з таким tenant_id не знайдено" })
      }
      updateFields.tenant_id = new ObjectId(updateFields.tenant_id)
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

// Отримати договори по жильцю
const getContractsByTenant = async (req, res) => {
  const tenantId = req.params.tenantId

  if (!ObjectId.isValid(tenantId)) {
    return res.status(400).json({ message: "Невірний формат ID жильця" })
  }

  try {
    const db = getDB()

    const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(tenantId) })
    if (!tenant) {
      return res.status(404).json({ message: "Жильця не знайдено" })
    }

    const contracts = await db
      .collection("contracts")
      .aggregate([
        { $match: { tenant_id: new ObjectId(tenantId) } },
        {
          $lookup: {
            from: "tenants",
            localField: "tenant_id",
            foreignField: "_id",
            as: "tenant",
          },
        },
        {
          $unwind: {
            path: "$tenant",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "houses",
            localField: "tenant.house_id",
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
      tenant: {
        _id: tenant._id,
        name: tenant.name,
      },
      contracts,
      totalContracts: contracts.length,
    })
  } catch (error) {
    console.error("Помилка при отриманні договорів жильця:", error)
    res.status(500).json({ message: "Не вдалося отримати дані." })
  }
}

module.exports = {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  getContractsByTenant,
}
