export interface PaymentsReconciliation {
  PaymentsMonth: number
  PaymentsYear: number
  CreditId: number
  PayAmountCashbox: number
  PayAmountCreditLogs: number
  PayAmountDifference: number
}

export interface CreditsReconciliation {
  CreditMonth: number
  CreditYear: number
  CreditId: number
  CreditStatus: string
  CreditSum: number
  CreditPercents: number
  PayAmountBody: number
  PayAmountPercent: number
  PayAmountDifference: number
  PayPercentDifference: number
}

export interface TabModel {
  id: number,
  title: string,
  description: string
}
