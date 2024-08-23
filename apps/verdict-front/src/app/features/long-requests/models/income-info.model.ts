export interface IncomeQuarterModel {
  IncomeSum: number
  Sign: string
  Quarter?: number
  Year?: number
  CompanyName?: string
  IsSolvent: boolean
  Bucket: number
}


export interface IncomeInfoModel {
  LastCheckDate?: Date
  IncomesByQuarter?: IncomeQuarterModel[]
}



