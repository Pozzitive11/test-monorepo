export interface PropertyOwner {
  FullName?: string
  OwnerType: string
  INN?: string
  PartOfPropertyRight?: number
}

export interface PropertyObjectModel {
  OurMortgage: boolean
  Description: string
  PropertyType: string
  CheckStatus: string
  PartOfPropertyRight?: number | null
  OtherOwners: PropertyOwner[]
  CostValuationOnPurchase?: number | null
  CostValuation?: number | null
  DateOfValuation?: Date | string | null
  CostValuationPerUnit?: number | null
  CollateralArea?: number | null
  RiskGroup?: string | null
  SignedPeopleInfo?: string | null
  EncumbranceInfo?: string | null
  ArrestInfo?: string | null
  MortgageInfo?: string | null
  MoratoriumInfo?: string | null
  LTV?: number | null
  LTVArgumentation?: string | null
}



