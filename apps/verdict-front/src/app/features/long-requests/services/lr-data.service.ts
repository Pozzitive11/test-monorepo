import { DestroyRef, inject, Injectable, signal } from '@angular/core'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { LrHttpService } from './lr-http.service'
import { CloseConditionsModel } from '../models/close-conditions.model'
import { ContractBasicInfoModel } from '../models/contract-basic-info.model'
import { FinancialInfoModel } from '../models/financial-info.model'
import { catchError, Observable, of } from 'rxjs'
import { AutoObjectModel } from '../models/auto-object.model'
import { PropertyObjectModel } from '../models/property-object.model'
import { RiskGroupsModel } from '../models/risk-groups.model'
import { DictionaryModel } from '../../../shared/models/dictionary.model'
import { GuarantorInfoModel } from '../models/guarantor-info.model'
import { EpDetailedInfoModel } from '../models/ep-detailed-info.model'
import { PropertyInventoryModel } from '../models/property-inventory.model'
import { IncomeStagesModel } from '../models/income-stages.model'
import { ArrestStagesModel } from '../models/arrest-stages.model'
import { MvsStagesModel } from '../models/mvs-stages.model'
import { OthersEPInfoModel } from '../models/others-ep-info.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ContractPromotionsInfoModel } from '../models/contract-promotions-info.model'

@Injectable({
  providedIn: 'root'
})
export class LrDataService {
  private readonly httpService = inject(LrHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly destroyRef = inject(DestroyRef)

  selectedContractId?: number
  activeTab: string = 'basicInfo'
  loading = {
    closeConditions: false,
    contractBasicInfo: false,
    financialInfo: false,
    autoMortgageInfo: false,
    autoAdditionalInfo: false,
    mortgagePropertyInfo: false,
    additionalPropertyInfo: false,
    crossingTheBorders: false,
    incomeInfo: false,
    epTotalInfo: false,
    bankruptcyInfo: false,

    epDetailedInfo: false,
    epDetailedInfoRelated: false,
    propertyInventoryInfo: false,
    incomeStagesInfo: false,
    arrestStagesInfo: false,
    mvsStagesInfo: false,
    othersEPInfoModel: false,
    nksManagement: false
  }

  riskGroups: RiskGroupsModel[] = []
  moratoriumReasons: DictionaryModel[] = []
  closeConditions: CloseConditionsModel = { Debt: 0, PayCurrency: 'UAH', SumToPay: 0 }
  contractBasicInfo: ContractBasicInfoModel = { Debtors: [], Guarantors: [], RegisterName: '' }
  financialInfo?: FinancialInfoModel
  mortgageObjectsInfo: {
    auto?: AutoObjectModel[]
    property?: PropertyObjectModel[]
  } = {}

  epDetailedInfo?: EpDetailedInfoModel[]
  epDetailedInfoRelated?: EpDetailedInfoModel[]
  propertyInventoryInfo?: PropertyInventoryModel[]
  incomeStagesInfo?: IncomeStagesModel[]
  arrestStagesInfo?: ArrestStagesModel[]
  mvsStagesInfo?: MvsStagesModel[]
  othersEPInfo?: OthersEPInfoModel[]
  contractPromotions = signal<ContractPromotionsInfoModel[]>([])

  guarantors: { [key: string]: GuarantorInfoModel } = {}

  get everythingLoaded() {
    return !Object.values(this.loading).some((value) => value)
  }

  getRiskGroups() {
    this.httpService.getRiskGroups().subscribe({
      next: (groups) => (this.riskGroups = groups),
      error: async (err) => await this.messageService.alertError(err)
    })
  }

  getMoratoriumReasons() {
    this.httpService.getMoratoriumReasons().subscribe({
      next: (reasons) => (this.moratoriumReasons = reasons),
      error: async (err) => await this.messageService.alertError(err)
    })
  }

  getCloseConditions(promotionId?: number, contractId?: number) {
    this.closeConditions = { Debt: 0, PayCurrency: 'UAH', SumToPay: 0 }
    this.loading.closeConditions = true
    let closeConditions$: Observable<CloseConditionsModel>

    if (promotionId) closeConditions$ = this.httpService.getCloseConditions(promotionId)
    else if (contractId) closeConditions$ = this.httpService.getCloseConditionsContract(contractId)
    else {
      this.loading.closeConditions = false
      this.messageService.sendError('Виникла помилка при спробі завантажити інфо по ДС/РС.')
      return
    }

    closeConditions$.subscribe({
      next: (value) => (this.closeConditions = value),
      error: async (err) => {
        this.loading.closeConditions = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.closeConditions = false)
    })
  }

  getContractBasicInfo(contractId: number) {
    this.contractBasicInfo = { Debtors: [], Guarantors: [], RegisterName: '' }
    this.loading.contractBasicInfo = true
    this.httpService.getContractBasicInfo(contractId).subscribe({
      next: (value) => (this.contractBasicInfo = value),
      error: async (err) => {
        this.loading.contractBasicInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.contractBasicInfo = false)
    })
  }

  getFinancialInfo(contractId: number) {
    this.financialInfo = undefined
    this.loading.financialInfo = true
    this.httpService.getFinancialInfo(contractId).subscribe({
      next: (value) => (this.financialInfo = value),
      error: async (err) => {
        this.loading.financialInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.financialInfo = false)
    })
  }

  getCarsObjectsInfo(contractId: number, isMortgage: boolean, inn?: string) {
    if (!inn && isMortgage) this.mortgageObjectsInfo = {}
    if (isMortgage) this.loading.autoMortgageInfo = true
    else this.loading.autoAdditionalInfo = true

    this.httpService.getAutoObjectsInfo(contractId, isMortgage, inn).subscribe({
      next: (value) => {
        if (isMortgage && !inn) this.mortgageObjectsInfo.auto = value
        // else if (!inn)
        //   this.additionalObjectsInfo.auto = value
        else this.guarantors[inn || ''].AdditionalObjectsInfo.auto = value
      },
      error: async (err) => {
        if (isMortgage) this.loading.autoMortgageInfo = false
        else this.loading.autoAdditionalInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => {
        if (isMortgage) this.loading.autoMortgageInfo = false
        else this.loading.autoAdditionalInfo = false
      }
    })
  }

  getAdditionalPropertyObjectsInfo(contractId: number, inn: string) {
    this.loading.additionalPropertyInfo = true
    this.httpService.getAdditionalPropertyObjectsInfo(contractId, inn).subscribe({
      next: (value) => (this.guarantors[inn].AdditionalObjectsInfo.property = value),
      error: async (err) => {
        this.loading.additionalPropertyInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.additionalPropertyInfo = false)
    })
  }

  getMortgagePropertyObjectsInfo(contractId: number) {
    this.loading.mortgagePropertyInfo = true
    this.httpService.getMortgagePropertyObjectsInfo(contractId).subscribe({
      next: (value) => (this.mortgageObjectsInfo.property = value),
      error: async (err) => {
        this.loading.mortgagePropertyInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.mortgagePropertyInfo = false)
    })
  }

  getPropertyCheck(contractId: number, inn: string) {
    this.guarantors[inn].PropertyCheck = undefined

    this.httpService.getPropertyCheck(contractId, inn).subscribe({
      next: (value) => (this.guarantors[inn].PropertyCheck = value),
      error: async (err) => await this.messageService.alertError(err)
    })
  }

  getCrossingTheBordersInfo(contractId: number, inn: string) {
    this.guarantors[inn].CrossingTheBorders = undefined

    this.loading.crossingTheBorders = true
    this.httpService.getMegaSolvencyInfo(contractId, inn).subscribe({
      next: (value) => (this.guarantors[inn].CrossingTheBorders = value),
      error: async (err) => {
        this.loading.crossingTheBorders = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.crossingTheBorders = false)
    })
  }

  getIncomeInfo(contractId: number, inn: string) {
    this.guarantors[inn].IncomeInfo = undefined

    this.loading.incomeInfo = true
    this.httpService.getIncomeInfo(contractId, inn).subscribe({
      next: (value) => (this.guarantors[inn].IncomeInfo = value),
      error: async (err) => {
        this.loading.incomeInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.incomeInfo = false)
    })
  }

  getEPTotalInfo(contractId: number, inn: string) {
    this.guarantors[inn].EpTotalInfo = undefined

    this.loading.epTotalInfo = true
    this.httpService.getEPTotalInfo(contractId, inn).subscribe({
      next: (value) => (this.guarantors[inn].EpTotalInfo = value),
      error: async (err) => {
        this.loading.epTotalInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.epTotalInfo = false)
    })
  }

  getBankruptcyInfo(contractId: number, inn: string) {
    this.guarantors[inn].BankruptcyInfo = undefined

    this.loading.bankruptcyInfo = true
    this.httpService.getBankruptcyInfo(contractId, inn).subscribe({
      next: (value) => (this.guarantors[inn].BankruptcyInfo = value),
      error: async (err) => {
        this.loading.bankruptcyInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.bankruptcyInfo = false)
    })
  }

  getEPDetailedInfo(contractId: number, isRelated: boolean = false) {
    if (isRelated) {
      delete this.epDetailedInfoRelated
      this.loading.epDetailedInfoRelated = true
    } else {
      delete this.epDetailedInfo
      this.loading.epDetailedInfo = true
    }

    this.httpService.getEPDetailedInfo(contractId, isRelated).subscribe({
      next: (value) => (isRelated ? (this.epDetailedInfoRelated = value) : (this.epDetailedInfo = value)),
      error: async (err) => {
        isRelated ? (this.loading.epDetailedInfoRelated = false) : (this.loading.epDetailedInfo = false)
        await this.messageService.alertError(err)
      },
      complete: () => (isRelated ? (this.loading.epDetailedInfoRelated = false) : (this.loading.epDetailedInfo = false))
    })
  }

  getPropertyInventoryInfo(contractId: number, inn?: string) {
    if (!inn) delete this.propertyInventoryInfo

    this.loading.propertyInventoryInfo = true
    this.httpService.getPropertyInventoryInfo(contractId, inn).subscribe({
      next: (value) => (this.propertyInventoryInfo = value),
      error: async (err) => {
        this.loading.propertyInventoryInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.propertyInventoryInfo = false)
    })
  }

  getIncomeStagesInfo(contractId: number, inn?: string) {
    if (!inn) delete this.incomeStagesInfo

    this.loading.incomeStagesInfo = true
    this.httpService.getIncomeStagesInfo(contractId, inn).subscribe({
      next: (value) => (this.incomeStagesInfo = value),
      error: async (err) => {
        this.loading.incomeStagesInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.incomeStagesInfo = false)
    })
  }

  getArrestStagesInfo(contractId: number, inn?: string) {
    if (!inn) delete this.arrestStagesInfo

    this.loading.arrestStagesInfo = true
    this.httpService.getArrestStagesInfo(contractId, inn).subscribe({
      next: (value) => (this.arrestStagesInfo = value),
      error: async (err) => {
        this.loading.arrestStagesInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.arrestStagesInfo = false)
    })
  }

  getMVSStagesInfo(contractId: number, inn?: string) {
    if (!inn) delete this.mvsStagesInfo

    this.loading.mvsStagesInfo = true
    this.httpService.getMVSStagesInfo(contractId, inn).subscribe({
      next: (value) => (this.mvsStagesInfo = value),
      error: async (err) => {
        this.loading.mvsStagesInfo = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.mvsStagesInfo = false)
    })
  }

  getOthersEPInfoModel(contractId: number) {
    this.loading.othersEPInfoModel = true
    this.httpService.getOthersEPInfo(contractId).subscribe({
      next: (value) => (this.othersEPInfo = value),
      error: async (err) => {
        this.loading.othersEPInfoModel = false
        await this.messageService.alertError(err)
      },
      complete: () => (this.loading.othersEPInfoModel = false)
    })
  }

  getContractPromotions(contractId: string) {
    this.loading.nksManagement = true
    this.httpService
      .getContractPromotions(contractId)
      .pipe(
        catchError((err) => {
          this.messageService.sendError(err.error.detail)
          this.loading.nksManagement = false
          return of([])
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.contractPromotions.set(data)
        this.loading.nksManagement = false
      })
  }
}
