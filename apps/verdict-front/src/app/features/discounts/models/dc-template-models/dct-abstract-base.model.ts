import { DctBaseModel } from './dct-base.model'

export interface DctAbstractBaseModel extends DctBaseModel {
  PromotionId: number
  ContractId: number
  RefNumber: string
  RefNumberDate: Date
  ClientName: string
  ClientINN: string | null
  AssignmentDocNum: string | null
  AssignmentDocDate: Date | null
  ContractNum: string
  ContractDate: Date
  FirstCreditor: string | null
  Company: 'ДФ' | 'КЦ'
  IsEPOpen: boolean | null
  Agreed: string | null
  DebtTypeUsed: string | null
  SumToPay: number | null
  SumToClose: number | null
  PaymentDateLimit: string | null
}

