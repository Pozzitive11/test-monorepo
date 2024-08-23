import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { mergeMap, of } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { DictionaryModel } from '../../../shared/models/dictionary.model'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { ArrestStagesModel } from '../models/arrest-stages.model'
import { AutoObjectModel } from '../models/auto-object.model'
import { BankruptcyInfoModel } from '../models/bankruptcy-info.model'
import { BasicLongRequestInfoModel } from '../models/basic-long-request-info.model'
import { CloseConditionsModel } from '../models/close-conditions.model'
import { ContractBasicInfoModel } from '../models/contract-basic-info.model'
import { ContractPromotionsInfoModel } from '../models/contract-promotions-info.model'
import { EpDetailedInfoModel } from '../models/ep-detailed-info.model'
import { EpTotalInfoModel } from '../models/ep-total-info.model'
import { FinancialInfoModel } from '../models/financial-info.model'
import { IncomeInfoModel } from '../models/income-info.model'
import { IncomeStagesModel } from '../models/income-stages.model'
import { InflationReqModel } from '../models/inflation.model'
import { MegaSolvencyModel } from '../models/mega-solvency.model'
import { MvsStagesModel } from '../models/mvs-stages.model'
import { OthersEPInfoModel } from '../models/others-ep-info.model'
import { PropertyCheckModel } from '../models/property-check.model'
import { PropertyInventoryModel } from '../models/property-inventory.model'
import { PropertyObjectModel } from '../models/property-object.model'
import { RiskGroupsModel } from '../models/risk-groups.model'

@Injectable({
  providedIn: 'root'
})
export class LrHttpService {
  private readonly http = inject(HttpClient)
  private readonly url = (environment.BACKEND_URL || window.location.origin) + environment.API_BASE_URL + environment.long_requests_api_url

  getContractPromotions(contractId: string) {
    return this.http.get<ContractPromotionsInfoModel[]>(
      this.url + `/contract_promotions/${contractId}`
    )
  }

  getCloseConditions(promotionId: number) {
    return this.http.get<CloseConditionsModel>(
      this.url + `/close_conditions/${promotionId}`
    )
  }

  getCloseConditionsContract(contractId: number) {
    return this.http.get<CloseConditionsModel>(
      this.url + `/close_conditions/contract/${contractId}`
    )
  }

  getContractBasicInfo(contractId: number) {
    return this.http.get<ContractBasicInfoModel>(
      this.url + `/contract_basic_info/${contractId}`
    )
  }

  getContractFromPromId(promotionId: number) {
    return this.http.get<number>(
      this.url + `/contract_from_promotion_id/${promotionId}`
    )
  }

  getFinancialInfo(contractId: number) {
    return this.http.get<FinancialInfoModel>(
      this.url + `/financial_info/${contractId}`
    )
  }

  getAutoObjectsInfo(contractId: number, isMortgage: boolean, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    const mortgage = isMortgage ? 'mortgage' : 'additional'
    return this.http.get<AutoObjectModel[]>(
      this.url + `/client_objects/auto/${mortgage}/${contractId}`,
      { params }
    )
  }

  getAdditionalPropertyObjectsInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    return this.http.get<PropertyObjectModel[]>(
      this.url + `/client_objects/property/additional/${contractId}`,
      { params }
    )
  }

  getMortgagePropertyObjectsInfo(contractId: number) {
    return this.http.get<PropertyObjectModel[]>(
      this.url + `/client_objects/property/mortgage/${contractId}`
    )
  }

  getPropertyCheck(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    return this.http.get<PropertyCheckModel>(
      this.url + `/client_objects/property/check/${contractId}`,
      { params }
    )
  }

  getMegaSolvencyInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    return this.http.get<MegaSolvencyModel>(
      this.url + `/megasolvency/${contractId}`,
      { params }
    )
  }

  getIncomeInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    return this.http.get<IncomeInfoModel>(
      this.url + `/income_info/${contractId}`,
      { params }
    )
  }

  getEPTotalInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    return this.http.get<EpTotalInfoModel>(
      this.url + `/ep_overall_info/${contractId}`,
      { params }
    )
  }

  getOthersEPInfo(contractId: number) {
    return this.http.get<OthersEPInfoModel[]>(
      this.url + `/other_enforcement_proceedings/${contractId}`
    )
  }

  getEPDetailedInfo(contractId: number, isRelated: boolean = false) {
    const params = new HttpParams()
      .set('contract_id', contractId)
      .set('is_related', isRelated)

    return this.http.get<EpDetailedInfoModel[]>(
      this.url + `/enforcement_proceedings`,
      { params }
    )
  }

  getPropertyInventoryInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('contract_id', contractId)
      .set('client_inn', inn || '')

    return this.http.get<PropertyInventoryModel[]>(
      this.url + `/property_inventarization`,
      { params }
    )
  }

  getIncomeStagesInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('contract_id', contractId)
      .set('client_inn', inn || '')

    return this.http.get<IncomeStagesModel[]>(
      this.url + `/income_stages`,
      { params }
    )
  }

  getArrestStagesInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('contract_id', contractId)
      .set('client_inn', inn || '')

    return this.http.get<ArrestStagesModel[]>(
      this.url + `/arrest_stages`,
      { params }
    )
  }

  getMVSStagesInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('contract_id', contractId)
      .set('client_inn', inn || '')

    return this.http.get<MvsStagesModel[]>(
      this.url + `/mvs_stages`,
      { params }
    )
  }

  getBankruptcyInfo(contractId: number, inn?: string) {
    const params = new HttpParams()
      .set('client_inn', inn || '')

    return this.http.get<BankruptcyInfoModel>(
      this.url + `/bankruptcy_info/${contractId}`,
      { params }
    )
  }

  getRiskGroups() {
    return this.http.get<RiskGroupsModel[]>(
      this.url + `/risk_groups`
    )
  }

  getMoratoriumReasons() {
    return this.http.get<DictionaryModel[]>(
      this.url + `/moratorium_reasons`
    )
  }

  createExcelFromData(dataToSend: BasicLongRequestInfoModel, addToDB: boolean = false) {
    const params = new HttpParams().set('add_to_db', addToDB)
    return this.http.post<Blob>(
      this.url + `/excel_file`,
      dataToSend,
      { responseType: 'blob' as 'json', params }
    )
  }

  consolidateInfoFromFile(fileForm: FormData, onlyBankruptcy: boolean, useBackup: boolean) {
    const params = new HttpParams()
      .set('only_bankruptcy', onlyBankruptcy)
      .set('use_backup', useBackup)
    return this.http.post<Blob>(
      this.url + '/consolidation_info_from_file',
      fileForm,
      {
        params,
        responseType: 'blob' as 'json'
      }
    )
  }

  consolidateInfoFromList(ContractIds: string[], onlyBankruptcy: boolean, useBackup: boolean) {
    const params = new HttpParams()
      .set('only_bankruptcy', onlyBankruptcy)
      .set('use_backup', useBackup)
    return this.http.post<Blob>(
      this.url + '/consolidation_info',
      { ContractIds },
      {
        params,
        responseType: 'blob' as 'json'
      }
    )
  }

  calculateAccruedSum(inflation: InflationReqModel, type: 'inflation' | 'three_percent') {
    const decisionSums = inflation.DecisionSums.filter(decSum => {
      if (type === 'inflation')
        return decSum.Currency === 'UAH'
      else
        return true
    })

    return of(...decisionSums).pipe(
      mergeMap((decSum) => {
        const params = new HttpParams()
          .set('contract_id', inflation.ContractId)
          .set('decision_sum', decSum.Sum * decSum.CurrencyValue)
          .set('start_date', UtilFunctions.formatDate(inflation.StartDate, false, '%Y-%m-%d'))
          .set('end_date', UtilFunctions.formatDate(inflation.EndDate, false, '%Y-%m-%d'))

        return this.http.get<number>(
          this.url + (type === 'inflation' ? `/calculated_inflation` : `/calculated_three_percents`),
          { params }
        )
      })
    )

  }
}






