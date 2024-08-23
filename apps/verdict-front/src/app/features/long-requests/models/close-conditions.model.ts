export interface CloseConditionsModel {
  PayCurrency: string
  Debt: number
  SumToPay: number
  DiscountPercent?: number
  RestructuringMonths?: number
  RestructuringPaymentPerMonth?: number
  RestructuringFirstPayment?: Date | string
  PaymentDateLimit?: Date | string
  ClosingMethod?: string
  Comment?: string
  TaxObligations?: string
}
