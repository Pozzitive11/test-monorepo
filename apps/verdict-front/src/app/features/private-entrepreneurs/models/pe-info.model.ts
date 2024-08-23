import { PEAccountInfoModel } from './pe-account-info.model'

export interface PEInfoModel {
  id: number
  Name: string | null
  INN: string | null
  IsActive: boolean
  Accounts: PEAccountInfoModel[]
}
