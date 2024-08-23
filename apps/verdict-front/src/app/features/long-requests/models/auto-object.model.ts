export interface AutoObjectModel {
  OurMortgage: boolean
  Description: string
  CostValuation?: number | null
  CostValuationOnPurchase?: number | null
  ValuationDate?: Date | string | null
  MTSBU?: string | null
  Wanted?: string | null
  EncumbranceInfo?: string | null
  MortgageInfo?: string | null
  LTV?: number | null
  LTVArgumentation?: string | null
}



