export interface DcPromotionSimpleModel {
  id: number
  ContractId: number
  EntryDate: Date
  Debt: number
  PaymentDateLimit: Date | null
  DiscountPercent: number
  RestructuringMonths: number
  Agreed: string | null
  SumToPay: number
}
