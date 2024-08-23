export interface EpDetailedInfoModel {
  ContractId?: number
  ClientINN?: string
  ClientName?: string
  ClientType?: string
  OriginalsStartDate?: Date
  OriginalsFinishDate?: Date
  RNTStartDate?: Date
  RNTResult?: boolean
  RequirementDate?: Date
  NotarStatDate?: Date
  CRMDate?: Date
  ELDate?: Date
  ELType?: string
  ELNum?: string
  Notary?: string
  DateReceiptEL?: Date
  StatementDate?: Date
  TransferDate?: Date
  PrivateAgent?: string
  AvansDate?: Date
  AvansSum?: number
  EPSum?: number
  EPNum?: number
  AccessIdentifier?: string
  NoIdentifierDays?: number
  EPDate?: Date
  EPState?: string
  Agency?: string
  Collector?: string
  EPFinalDate?: Date
  LastAction?: string

  EPFinalState?: string
  PrivateAgentReward?: number
  RewardPayer?: string
}

