import { DecisionSum } from './decision-sum.model'

export interface InflationModel {
  IsPossible: boolean
  DecisionDate: Date | null
  IsCurrencyPresent: boolean
  DecisionSums: DecisionSum[]
  InflationSum: number
  ThreePercentSum: number
}

export interface InflationReqModel extends InflationModel {
  ContractId: number
  StartDate: Date
  EndDate: Date
}
