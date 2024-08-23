import { DestroyRef, inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { ScoreInfo, ScoreModel } from '../models/dc-basic-models'
import { DcChosenConditions, Shown } from '../models/dc-chosen-conditions'
import { ClientPromotionInfoModel, Currency } from '../models/dc-client-promotion-info-model'
import { DcPromotionForDocsModel } from '../models/dc-promotion-for-docs.model'
import { DcHttpService } from './dc-http.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'

interface ShownDocUploadType {
  military: boolean
  other: boolean
  identification: boolean
}

interface ChosenConditionSwitch {
  contractId: number
  newCondition: 'StandardDC' | 'StandardRS' | 'IndividualDC' | 'IndividualRS' | 'RepeatedDC' | 'RepeatedRS' | undefined
}

interface DocType {
  id: number
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class DcDataService {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly router = inject(Router)

  readonly otherDocTypes: DocType[] = [
    { id: 0, name: 'Свідоцтво про смерть' },
    { id: 0, name: 'Свідоцтво про смерть родича' },
    { id: 0, name: 'Справка про інвалідність' },
    { id: 0, name: 'Інше' }
  ]

  readonly identificationDocTypes: DocType[] = [
    { id: 0, name: 'Внутрішній паспорт громадянина України' },
    { id: 0, name: 'АйДі (замість паспорту)' },
    { id: 0, name: 'Закордонний паспорт громаядянина Уукраїни' },
    { id: 0, name: 'Посвідка ТПО' },
    { id: 0, name: 'ІПН' },
    { id: 0, name: 'Інше' }
  ]

  contractIds: number[] = []
  dataIsLoading: boolean = false

  contractId: string = ''
  scoreModel: ScoreModel[] = []
  scoreInfoData: ScoreInfo[] = []
  chosenConditions: DcChosenConditions[] = []
  shown: Shown[] = []
  confirmedChosenConditions: ClientPromotionInfoModel[] = []
  excludedContracts: number[] = []
  clientHistory: { [key: string]: any }[] = []
  newChosenCondition$ = new BehaviorSubject<ChosenConditionSwitch | undefined>(undefined)

  shownDocUploadType: ShownDocUploadType = {
    military: false,
    other: false,
    identification: false
  }
  militaryDocTypes: DocType[] = []

  contractPromotion: DcPromotionForDocsModel | null = null

  currencyDictionary: Currency[] = []
  currencyId: number

  constructor() {
    this.httpService.getMilitaryDocTypes(false).subscribe({
      next: (value) => (this.militaryDocTypes = value)
    })
  }

  clearData() {
    this.contractIds = []
    this.scoreModel = []
    this.scoreInfoData = []
    this.chosenConditions = []
    this.shown = []
    this.confirmedChosenConditions = []
    this.excludedContracts = []
    this.newChosenCondition$.next(undefined)
  }

  getScoreModel() {
    this.dataIsLoading = true
    this.httpService.buildScoreModel(+this.contractId).subscribe({
      next: (value) => {
        this.scoreModel = value
        this.contractIds = value.map((val) => val.ContractId)
        this.fillScoreInfo()
      },
      error: (err) => {
        this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.dataIsLoading = false
      },
      complete: () => (this.dataIsLoading = false)
    })
  }

  setCurrencyDictionary() {
    this.httpService
      .getCurrencyDictionary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currency) => (this.currencyDictionary = currency))
  }

  findCurrencyId() {
    const currencyFind = this.currencyDictionary.find(
      (currency) => currency.Name === this.scoreInfoData[0].FactCurrency
    )
    if (currencyFind) {
      this.currencyId = currencyFind.id
    }
  }

  getClientsHistory() {
    this.httpService
      .getClientsHistory([+this.contractId])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => (this.clientHistory = data))
  }

  documentRequest() {
    this.dataIsLoading = true
    this.httpService.getContractPromotion(+this.contractId).subscribe({
      next: (value) => (this.contractPromotion = value),
      error: (err) => {
        this.messageService.sendError(`${err.status}: ${err.error.detail}`)
        this.dataIsLoading = false
      },
      complete: () => {
        this.dataIsLoading = false
        this.router.navigate(['/discounts/info'], {
          queryParams: {
            contractId: this.contractId,
            requestForDocuments: true
          }
        })
      }
    })
  }

  saveDocumentsRequest(callback: () => void = () => {}) {
    if (!this.contractPromotion) {
      this.messageService.sendError('Відсутні дані для збереження')
      return
    }

    this.dataIsLoading = true
    this.httpService.saveDocumentsRequest(this.contractPromotion).subscribe({
      next: (value) => this.messageService.sendInfo(value.description),
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.dataIsLoading = false
      },
      complete: () => {
        this.dataIsLoading = false
        this.contractPromotion = null
        callback()
      }
    })
  }

  fillScoreInfo() {
    if (this.scoreModel.length === 0) return

    this.scoreInfoData = []
    this.chosenConditions = []

    for (let scoreModel of this.scoreModel) {
      const scoreInfo: ScoreInfo = {
        ...scoreModel,
        Discounts: {
          WriteOffPercent: scoreModel.MaxWriteOff * 100,
          BodyPay: scoreModel.MinBodyPayMFO ? scoreModel.MinBodyPayMFO * scoreModel.Body : undefined
        },
        Restructuring: {
          MaxMonths: scoreModel.MaxMonthsRS || 0,
          MinPayment: scoreModel.MinPaymentRS || Infinity
        },
        Promotions: {
          DC: scoreModel.MaxWriteOff > 0,
          RS: (scoreModel.MaxMonthsRS || 0) > 0,
          Individual: scoreModel.IndividualConditions
        }
      }
      this.scoreInfoData.push(scoreInfo)

      const restructuringMaxMonths = Math.floor(scoreInfo.Debt / scoreInfo.Restructuring.MinPayment)
      const restructuringMonths =
        restructuringMaxMonths < scoreInfo.Restructuring.MaxMonths
          ? restructuringMaxMonths
          : scoreInfo.Restructuring.MaxMonths
      this.chosenConditions.push({
        ContractId: scoreModel.ContractId,
        restructuringMonths: scoreModel.RestructuringMonthsOld
          ? scoreModel.RestructuringMonthsOld
          : restructuringMonths,
        Comment: '',
        DenyReason: '',
        Denied: false,
        FineApplied: !!(scoreModel.RestructuringMonthsOld || scoreModel.AgreedSum),
        Promotions: {
          restructuringMonths: restructuringMonths,
          dcType: scoreInfo.Military && scoreInfo.CanUseNBodyPayment ? 'bodyPay' : 'writeOff'
        },
        Individual: {
          body: scoreInfo.Body,
          bodyPay: '' + scoreInfo.Discounts.BodyPay,
          bodyPayMonths: scoreInfo.Discounts.BodyPay ? scoreInfo.Discounts.BodyPay / scoreInfo.Body : 0,
          creditorType: scoreInfo.CreditorType,
          debt: scoreInfo.Debt,
          rsMonths: restructuringMonths,
          dcType: scoreInfo.Military && scoreInfo.CanUseNBodyPayment ? 'bodyPay' : 'writeOff',
          writeOffPercent: scoreInfo.Discounts.WriteOffPercent
        },
        LimitDate: '',
        AdditionalDocsFields: {
          AssignmentLetter: null,
          FactoringContract: null,
          Abstract: null,
          WritingOffContract: null,
          GuaranteeLetter: null,
          AccruingAppendix: null,
          Originals: null,
          IndividualTerm: ''
        }
      })

      this.shown.push({
        promotions: !scoreInfo.TempStopList,
        individual: false,
        repeated: !!scoreInfo.TempStopList,
        history: false
      })

      if (!!scoreModel.EternalStopList && !this.excludedContracts.includes(scoreModel.ContractId))
        this.excludedContracts.push(scoreModel.ContractId)
    }
    this.findCurrencyId()
  }

  calculateFinalDate(day: number, limitMonth: number, limitYear: number, isDC: boolean = false): string {
    if (limitMonth > 12) {
      limitYear++
      limitMonth -= 12
    }
    if (day > 20 && isDC) return UtilFunctions.formatDate(new Date(limitYear, limitMonth, 15))

    let limitDate = new Date(limitYear, limitMonth, 1)
    limitDate.setTime(limitDate.getTime() - 24 * 60 * 60 * 1000)

    return UtilFunctions.formatDate(limitDate)
  }

  todayIsTheLastDayOfMonth() {
    let tomorrow = new Date()
    const now = new Date()
    tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000)

    return now.getMonth() !== tomorrow.getMonth()
  }

  calculateDCFinalDate(): string {
    const now = new Date()
    return this.calculateFinalDate(now.getDate(), now.getMonth() + 1, now.getFullYear(), true)
  }

  calculateRSFinalDate(rsMonths: number): string {
    const now = new Date()
    let limitYear = Math.trunc(rsMonths / 12) + now.getFullYear()
    let limitMonth = (rsMonths % 12) + now.getMonth()

    if (this.todayIsTheLastDayOfMonth()) limitMonth++

    return this.calculateFinalDate(now.getDate(), limitMonth, limitYear)
  }
}
