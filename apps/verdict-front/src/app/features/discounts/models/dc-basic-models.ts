export interface ScoreModel {
  Main: boolean
  ContractId: number
  ProjectName?: string
  ContractCurrency?: string
  EternalStopList?: string
  TempStopList?: string
  StopDate?: string
  AgreedSum: number
  PaymentsRS: number
  FailedRSInfo: string[]
  RestructuringMonthsOld: number
  DiscountPercentOld: number | null
  EntryDate?: Date
  CreditorType: string
  CreditorName: string
  ClientName?: string
  INN?: string
  DaysAfterPurchase: number
  Debt: number
  Body: number
  DPD: number
  IntersectionContracts: number
  DenyCount: number
  Military: boolean
  Dead: boolean
  Disabled: boolean
  OtherDocs: boolean
  PS: boolean
  R1: boolean
  R2: boolean
  ClaimDateEnded: boolean
  OthersEP: number
  C1Ban: boolean
  AdditionalDiscount?: number
  CanUseNBodyPayment: boolean
  LastPromotionAgreed: string | null

  Score: number
  MaxWriteOff: number
  MinBodyPayMFO: number | null
  IndividualConditions: boolean
  MaxMonthsRS: number | null
  MinPaymentRS: number | null
}

export interface ScoreInfo {
  Main: boolean
  ContractId: number
  Score: number
  Military: boolean
  CreditorType: string
  ProjectName?: string
  ContractCurrency?: string
  FactCurrency?: string
  CreditorName: string
  ClientName?: string
  INN?: string
  Debt: number
  Body: number
  DPD: number
  EternalStopList?: string
  TempStopList?: string
  StopDate?: string
  AgreedSum: number
  LastPromotionAgreed: string | null
  FailedRSInfo: string[]
  PaymentsRS: number
  RestructuringMonthsOld: number
  DiscountPercentOld: number | null
  EntryDate?: Date
  CanUseNBodyPayment: boolean
  Discounts: {
    WriteOffPercent: number
    BodyPay?: number
  }
  Restructuring: {
    MaxMonths: number
    MinPayment: number
  }
  Promotions: {
    DC: boolean
    RS: boolean
    Individual: boolean
  }
}
