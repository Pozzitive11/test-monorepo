import { PropertyInfoFlowModel } from './property-info-flow.model'
import { CarInfoFlowModel } from './car-info-flow.model'

export interface PropertyInventoryModel {
  ClientINN?: string
  ContractId?: number
  ClientName?: string
  Department?: string
  PropertyObject?: PropertyInfoFlowModel
  CarObject?: CarInfoFlowModel
  InventoryIsDone?: boolean
  PropertyInQueue?: boolean
  ProcessingStatus?: string
  StatusDate?: Date

  CarPropertyCount: number
  LandCount: number
  ResidentialPropertyCount: number
  NonResidentialPropertyCount: number

  AuctionStatus?: string
  AuctionStatusDate?: Date
  AuctionStatusStop?: string
  PropertyToContractType?: string

  SaleSum?: number
  MoneyGettingSum?: number
  MoneyGettingDate?: Date

  InventarizationActDate?: Date
  NoInventarizationActDays?: number
  EstimatorApplicationDate?: Date
  NoEstimatorApplicationDays?: number
  EstimatorAssignmentDate?: Date
  NoEstimatorAssignmentDays?: number
  EstimationReady?: Date
  EstimationSum?: number
  NoEstimationDays?: number
  AuctionDate1?: Date
  AuctionResult1?: string
  SaleStartSum1?: number
  SaleResultSum1?: number
  AuctionDate2?: Date
  AuctionResult2?: string
  SaleStartSum2?: number
  SaleResultSum2?: number
  AuctionDate3?: Date
  AuctionResult3?: string
  SaleStartSum3?: number
  SaleResultSum3?: number
  AuctionDate4?: Date
  AuctionResult4?: string
  SaleStartSum4?: number
  SaleResultSum4?: number
  NoScheduledAuctionDays?: number
  AuctionStage?: string
  AuctionStageIsPositive?: 0 | 1 | 2 | 3
}
