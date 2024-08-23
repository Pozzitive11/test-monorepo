import { ppVerificationValues } from './pp-verification.enum'

export interface PpVerificationModel {
  Period: string | null
  ProjectName: string | null
  RNumber: number | null
  PaymentsCount: number
  PaymentsSum: number
  Type: ppVerificationValues | null
  TotalPaymentsCount: number
  TotalPaymentsSum: number
}
