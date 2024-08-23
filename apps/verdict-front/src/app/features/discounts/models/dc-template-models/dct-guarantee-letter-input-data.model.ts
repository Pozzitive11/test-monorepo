export interface DctGuaranteeLetterInputDataModel {
  PromotionId: number
  epState: string | null
  debtType: 'calculated' | 'contract' | 'register'
  SumToPay: number
  currentDebt: number
  SumToClose: number
  PaymentDateLimit: string | null
  contractId: number
  clientName: string
  clientINN: string | null
  debtRule: string

  confirmed: boolean
}
