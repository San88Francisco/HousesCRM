export enum UtilityType {
  ELECTRICITY = 'electricity',
  WATER_COLD = 'water_cold',
  WATER_HOT = 'water_hot',
  WATER_SUBSCRIPTION = 'water_subscription',
  GAS = 'gas',
  GAS_DELIVERY = 'gas_delivery',
  HEATING = 'heating',
  GARBAGE = 'garbage',
}

export const UTILITY_UNITS: Record<UtilityType, string> = {
  [UtilityType.ELECTRICITY]: 'кВт·год',
  [UtilityType.WATER_COLD]: 'м³',
  [UtilityType.WATER_HOT]: 'м³',
  [UtilityType.WATER_SUBSCRIPTION]: 'міс',
  [UtilityType.GAS]: 'м³',
  [UtilityType.GAS_DELIVERY]: 'міс',
  [UtilityType.HEATING]: 'Гкал',
  [UtilityType.GARBAGE]: 'міс',
}

export const METERED_UTILITIES: ReadonlySet<UtilityType> = new Set([
  UtilityType.ELECTRICITY,
  UtilityType.WATER_COLD,
  UtilityType.WATER_HOT,
  UtilityType.GAS,
  UtilityType.HEATING,
])

export const isMeteredUtility = (utilityType: UtilityType): boolean => METERED_UTILITIES.has(utilityType)
