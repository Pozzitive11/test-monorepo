export enum PpPaymentDocsVerificationTypesEnum {
  NO_REQUEST_ID = 'Платежі без прив\'язки до заявки в 1С',
  NO_DOC_PATH = 'Платежі без прив\'язки документів',
  NO_INFORMATION = 'Платежі без заповненої інформації',
  NO_CONTRACT_ID = 'Платежі без прив\'язки до НКС'
}

export type PpPaymentDocsVerificationTypes = keyof typeof PpPaymentDocsVerificationTypesEnum
export type PpPaymentDocsVerificationValues = typeof PpPaymentDocsVerificationTypesEnum[PpPaymentDocsVerificationTypes]
