import { DctBaseModel } from './dct-base.model'

export interface DctWritingOffDataModel extends DctBaseModel {
  PromotionId: number
  TemplateType: string
  OriginalTemplateType: string
  DebtTypeUsed: string
  ContractId: number
  ClientName: string
  ClientFirstName: string | null
  ClientLastName: string | null
  ClientMiddleName: string | null
  ClientNameInCase: string
  ClientINN: string | null
  ClientSex: string | null
  AssignmentDocNum: string | null
  AssignmentDocDate: Date | null
  Seller: string
  Buyer: string
  ContractNum: string
  ContractDate: Date
  FirstCreditor: string | null
  SumToClose: number
  Body: number
  Percent: number
  Fine: number
  Commission: number
  PaymentDateLimit: Date
  SumToPay: number
  BodyToPay: number
  PercentToPay: number
  FineToPay: number
  CommissionToPay: number
  EntryDate: Date
  DiscountSum: number
  ClientAddress: string | null
  PaymentPerMonth: number | null
  RestructuringMonths: number | null
  IsEPOpen: boolean
  MilitaryDocType: 'Мобілізований' | 'УБД' | null
  Company: 'ДФ' | 'КЦ'
  TemplateTypeChanged: boolean
}

export const newTemplateType = (model: DctWritingOffDataModel) => {
  let templateType = model.RestructuringMonths ? 'РС' : 'ДС'
  templateType = model.IsEPOpen ? `${templateType} ${model.Company} з ВП` : `${templateType} ${model.Company} без ВП`
  if (model.MilitaryDocType)
    templateType = `${templateType} (${model.MilitaryDocType})`

  return templateType
}
