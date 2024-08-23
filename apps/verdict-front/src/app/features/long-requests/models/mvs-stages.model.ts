import { MvsCarModel } from './mvs-car.model'

export interface MvsStagesModel {
  ClientINN?: string
  ContractId?: number
  EPNum?: number
  EPDate?: Date
  ClientName?: string
  ClientType?: string
  AnswerDateMVS?: Date
  PositiveResultMVS?: boolean
  NoAnswerMVS?: boolean
  NoAnswerDaysMVS?: number
  ResolutionDate?: Date
  NoResolutionWithReason?: boolean
  NoResolutionDays?: number

  OurEnforcementProceedingId: number

  Cars: MvsCarModel[]
}
