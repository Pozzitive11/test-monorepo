import { DcAdditionalDocsFields } from './dc-additional-docs-fields'

export interface DcClientPromotionUpdateModel extends DcAdditionalDocsFields {
  id: number
  PaymentDateLimit?: string
  DiscountPercent?: number
  RestructuringMonths?: number
  Comment?: string
  IndividualTerms?: string

  SendingDay?: string

  UserId?: number
  ContractOriginal?: boolean
}
