import { IncomeDetailedInfoModel } from './income-detailed-info.model'

export interface IncomeStagesModel {
  ClientINN?: string
  ContractId?: number
  EPNum?: number
  EPDate?: Date
  ClientName?: string
  ClientType?: string
  ResolutionDate?: Date
  AnswerDateDFS?: Date
  NoAnswerDaysDFS?: number
  PositiveResultDFS?: boolean
  AnswerDatePFU?: Date
  NoAnswerDaysPFU?: number
  PositiveResultPFU?: boolean
  NoResolutionFromPositiveDFS?: boolean
  Stopped?: boolean
  NoResolutionFromNegativeDFS?: boolean
  NoResolutionDays?: number
  IncomeDetailedInfo: IncomeDetailedInfoModel[]
  CompanyName?: string
  CompanyEDRPOU?: string
}
