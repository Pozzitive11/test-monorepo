import { AutoObjectModel } from './auto-object.model'
import { BankruptcyInfoModel } from './bankruptcy-info.model'
import { ClientInfoModel } from './client-info.model'
import { EpTotalInfoModel } from './ep-total-info.model'
import { IncomeInfoModel } from './income-info.model'
import { MegaSolvencyModel } from './mega-solvency.model'
import { PropertyCheckModel } from './property-check.model'
import { PropertyObjectModel } from './property-object.model'


export interface GuarantorInfoModel {
  Guarantor?: ClientInfoModel
  AdditionalObjectsInfo: {
    auto?: AutoObjectModel[],
    property?: PropertyObjectModel[]
  }
  PropertyCheck?: PropertyCheckModel
  CrossingTheBorders?: MegaSolvencyModel
  IncomeInfo?: IncomeInfoModel
  EpTotalInfo?: EpTotalInfoModel
  BankruptcyInfo?: BankruptcyInfoModel
}

export const guarantorInfoFilled = (guarantorInfo: GuarantorInfoModel) => {
  return !!guarantorInfo &&
    !!guarantorInfo.IncomeInfo &&
    !!guarantorInfo.BankruptcyInfo &&
    !!guarantorInfo.CrossingTheBorders &&
    !!guarantorInfo.PropertyCheck &&
    !!guarantorInfo.EpTotalInfo &&
    !!guarantorInfo.AdditionalObjectsInfo.auto &&
    !!guarantorInfo.AdditionalObjectsInfo.property
}


