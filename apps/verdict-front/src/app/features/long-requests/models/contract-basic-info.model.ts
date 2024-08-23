import { ClientInfoModel } from './client-info.model'

export interface ContractBasicInfoModel {
  ContractId?: number
  RegisterName: string
  ProjectName?: string
  FirstCreditor?: string
  Debtors: ClientInfoModel[]
  ContractNum?: string
  Intersections?: string
  Guarantors: ClientInfoModel[]
}
