import { DcAdditionalDocsFields } from './dc-additional-docs-fields'

export interface DcChosenConditionsPromotions {
  dcType: 'writeOff' | 'bodyPay'
  restructuringMonths: number
  chosen?: 'DC' | 'RS'
}

export interface DcChosenConditionsIndividual {
  dcType: 'writeOff' | 'bodyPay'
  bodyPayMonths: number
  creditorType: string
  writeOffPercent: number
  bodyPay: string
  rsMonths: number
  debt: number
  body: number
  chosen?: 'DC' | 'RS'
}

export interface DcChosenConditions {
  ContractId: number
  Comment: string
  DenyReason: string
  Denied: boolean
  DocsOnly?: boolean
  Promotions: DcChosenConditionsPromotions
  Individual: DcChosenConditionsIndividual
  Repeated?: 'DC' | 'RS'
  FineApplied: boolean
  restructuringMonths: number
  LimitDate: string
  AdditionalDocsFields: DcAdditionalDocsFields
}

export interface Shown {
  promotions: boolean
  individual: boolean
  repeated: boolean
  history: boolean
}
