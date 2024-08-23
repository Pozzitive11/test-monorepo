export interface BankruptcyCaseInfoModel {
  DateCheck: Date
  CaseNum?: string
  MaxCaseStage?: string
}

export interface BankruptcyInfoModel {
  LastDateCheck?: Date
  BankruptcyInfo: BankruptcyCaseInfoModel[]
  CasesCount: number
}

