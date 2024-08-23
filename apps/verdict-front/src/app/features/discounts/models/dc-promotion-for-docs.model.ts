import { DcAdditionalDocsFields } from './dc-additional-docs-fields'

export interface DcPromotionForDocsModel extends DcAdditionalDocsFields {
  id: number
  ContractId: number
  Agreed: string | null
  EntryDate: Date
  DiscountPercent: number | null
  RestructuringMonths: number | null
  PaymentDateLimit: Date
  Comment: string | null
}
