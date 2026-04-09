import * as yup from 'yup';

export const contractPdfProfileSchema = yup.object({
  landlordPip: yup.string().optional(),
  landlordPassportNumber: yup.string().optional(),
  landlordPassportIssued: yup.string().optional(),
  inspectionCount: yup.string().optional(),
});

export type ContractPdfProfileFormValues = yup.InferType<typeof contractPdfProfileSchema>;
