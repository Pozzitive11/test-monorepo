// export interface PpPaymentDocVerificationModel {
//   PaymentId: string
//   PaymentSum: number
//   UploadDate: string
//   RequestId: string | null
//   DocPath: string | null
//   SpendingTypeParent: number | null
//   SpendingType: number | null
//   Business: number | null
//   BusinessProject: number | null
// }

export interface IPpVerificationModel {
  Period: string
  PaymentsSum: number
  PaymentsCount: number
}

export interface PpPaymentDocsVerificationByPeriodModel {
  Period: string
  NoRequestId: IPpVerificationModel | null
  NoDocumentAttached: IPpVerificationModel | null
  NoFilledInformation: IPpVerificationModel | null
  Total: IPpVerificationModel
}
