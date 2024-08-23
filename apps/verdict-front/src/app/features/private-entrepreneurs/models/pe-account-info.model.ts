export interface PEAccountInfoModel {
  BankAccountId: number
  IBAN: string
  BankName: string | null
  MFO: string | null
  StartDate: Date | null
  EndDate: Date | null
  Balance: number | null
}
