import { InflationModel } from './inflation.model'

export interface FinancialInfoModel {
  ContractCurrency: string
  Cost?: number
  CostCurrency?: string
  CurrencyExchangeRate: number
  CurrencyExchangeRateCommercial?: number
  DebtOnPurchaseDate: number
  BodyOnPurchaseDate: number
  PercentsOnPurchaseDate: number
  CommissionOnPurchaseDate: number
  FineOnPurchaseDate: number
  AccruedSumOnPurchaseDate: number
  PaymentsSum: number
  LastPaymentDate?: Date
  Debt: number
  Body: number
  Percents: number
  Commission: number
  Fine: number
  AccruedSum: number
  Inflation: InflationModel
  CourtFee: number | null
  LegalAssistance: number | null
  AdvancePay: number | null
  DebtType: string | null
  ClaimSum: string | null
}
