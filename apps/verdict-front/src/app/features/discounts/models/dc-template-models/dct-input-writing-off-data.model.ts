export interface DctInputWritingOffDataModel {
  PromotionId: number
  debtType: 'calculated' | 'contract' | 'register'

  projectName: string
  bank: string
  entryDate: string
  agreement?: string
  projectManager?: string
  contractId: number
  clientName: string
  promotionType: string
  clientINN: string

  currentDebt: number

  debt: number
  body: number
  percents: number
  commission: number
  fine: number
  debtRule: string

  epState?: string

  sumToPay: number
  restructuring?: number

  confirmed?: boolean
}
