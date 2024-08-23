export interface IncomeDetailedInfoModel {
  ContractId: number
  INN?: string
  CheckDate: Date
  GroupTypeId: string
  EPNum: number

  SumEarned?: number
  Tax?: number
  Period?: string
  CompanyName?: string
  CompanyEDRPOU?: string
}
