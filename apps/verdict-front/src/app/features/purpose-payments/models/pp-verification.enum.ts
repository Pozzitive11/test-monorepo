export enum PpVerificationEnum {
  CONTRACT_PAYMENTS = 'Є в НКС, немає в PaymentsProcessing',
  PAYMENTS_PROCESSING = 'Є в PaymentsProcessing, немає в НКС'
}

export type ppVerificationTypes = keyof typeof PpVerificationEnum
export type ppVerificationValues = typeof PpVerificationEnum[ppVerificationTypes]
