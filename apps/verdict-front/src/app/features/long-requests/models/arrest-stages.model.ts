export interface ArrestStagesModel {
  ClientINN?: string
  ContractId?: number
  EPNum?: number
  EPSum?: number
  ClientName?: string
  ClientType?: string
  CheckingDate?: Date
  ArrestDate?: Date
  NoArrestWithReason?: boolean
  ArrestByINN?: boolean
  NoArrestBigMoney?: boolean
  NoArrestDays?: number
}
