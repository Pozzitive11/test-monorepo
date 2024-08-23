import { ContractBasicInfoModel } from './contract-basic-info.model'
import { CloseConditionsModel } from './close-conditions.model'
import { FinancialInfoModel } from './financial-info.model'
import { AutoObjectModel } from './auto-object.model'
import { PropertyObjectModel } from './property-object.model'
import { GuarantorInfoModel } from './guarantor-info.model'
import { IncomeStagesModel } from './income-stages.model'
import { ArrestStagesModel } from './arrest-stages.model'
import { PropertyInventoryModel } from './property-inventory.model'
import { MvsStagesModel } from './mvs-stages.model'
import { EpDetailedInfoModel } from './ep-detailed-info.model'
import { OthersEPInfoModel } from './others-ep-info.model'


export interface BasicLongRequestInfoModel {
  ContractId: number
  PromotionId?: number
  ContractBasicInfo: ContractBasicInfoModel
  CloseConditions: CloseConditionsModel
  FinancialInfo: FinancialInfoModel
  MortgageClientObjects?: { auto?: AutoObjectModel[], property?: PropertyObjectModel[] }
  GuarantorsInfo: GuarantorInfoModel[]
  EPDetailedInfo?: EpDetailedInfoModel[]
  EPDetailedInfoRelated?: EpDetailedInfoModel[]
  IncomeStages?: IncomeStagesModel[]
  ArrestStages?: ArrestStagesModel[]
  MVSStages?: MvsStagesModel[]
  PropertyInventory?: PropertyInventoryModel[]
  OthersEPInfo?: OthersEPInfoModel[]
}

