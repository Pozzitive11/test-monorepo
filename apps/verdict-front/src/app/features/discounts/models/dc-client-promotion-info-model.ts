import { DcAdditionalDocsFields } from './dc-additional-docs-fields'

export interface ClientPromotionInfoModel extends DcAdditionalDocsFields {
  ContractId: number
  Score: number
  Repeated?: boolean
  DenyReason?: string
  Promotion?: string
  DiscountPercent?: number
  PrivateAgentPayment?: number
  RestructuringMonths?: number
  Comment?: string
  Debt: number
  Body: number
  DPD: number
  Military: boolean
  Type: 'new' | 'denied' | 'repeated' | 'repeated_denied' | 'docs_only'
  LimitDate: string
  CurrencyId?: number
  
}

export interface Currency {
  id: number
  Name: string
}
