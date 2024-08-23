export interface PropertyInfoFlowModel {
  ClientINN?: string
  PropertyId?: number
  PartOfPropertyRight?: number
  PropertyType: string
  PropertySubType?: string
  PropertyDescription: string
  PledgeDescription?: string
  LandType?: string
  ControlledTerritory: boolean
  PaidPropertyCheck?: boolean
  PropertyUploaded?: boolean
  OwnerVerified?: boolean
  Mortgage?: boolean

  LandRegistryRequest?: Date
  LandRegistryNoRequestDays?: number
  LandRegistryResponseIsPositive?: boolean
  LandRegistryNoResponseDays?: number
  CNAPRequest?: Date
  CNAPNoRequestDays?: number
  CNAPResponseIsPositive?: boolean
  CNAPNoResponseDays?: number
  BTIRequest?: Date
  BTINoRequestDays?: number
  BTIResponseIsPositive?: boolean
  BTINoResponseDays?: number
}
