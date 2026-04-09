/** Лише поля, які користувач редагує в профілі; решта PDF — з контракту/будинку/орендаря (БД). */
export type ContractPdfProfile = {
  landlordPip?: string;
  landlordPassportNumber?: string;
  landlordPassportIssued?: string;
  inspectionCount?: string;
};
