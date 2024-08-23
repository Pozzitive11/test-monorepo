export interface ContractPromotionsInfoModel {
  ContractId: number
  RegisterName: string
  ProjectName?: string
  RegisterStatus?: string
  ClientPromotionId: number
  Agreed?: string
  EntryDate: Date
  DiscountPercent?: number
  RestructuringMonths?: number
  PaymentDateLimit: Date
  Comment?: string
}
