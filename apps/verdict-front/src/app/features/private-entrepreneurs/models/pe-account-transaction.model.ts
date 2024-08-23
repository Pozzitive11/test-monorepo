export interface PEAccountTransactionModel {
  BankAccountId: number
  PaymentType: string
  PaymentSubType: string | null
  EntryDate: Date
  TransactionSum: number
  OperationType: string
}


