import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core'
import { DcDataService } from '../../services/dc-data.service'
import { DcHttpService } from '../../services/dc-http.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { DcAdditionalDocsFields, dcAdditionalDocsFieldsFilled } from '../../models/dc-additional-docs-fields'
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe'
import { DcAdditionalDocsForClientReqComponent } from '../dc-additional-docs-for-client-req/dc-additional-docs-for-client-req.component'
import { DcOperatorInfoComponent } from '../dc-operator-info/dc-operator-info.component'
import { NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'
import { ActivatedRoute } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
@Component({
  selector: 'dc-info-container',
  templateUrl: './dc-info-container.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgbProgressbar,
    NgFor,
    NgClass,
    DcOperatorInfoComponent,
    NgbTooltip,
    DcAdditionalDocsForClientReqComponent,
    DecimalPipe,
    FormatDatePipe,
    LoadingBarComponent
  ]
})
export class DcInfoContainerComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DcDataService)
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly destroyRef = inject(DestroyRef)

  shownContractId!: number
  mode: 'info' | 'document' = 'info'

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.dataService.contractId = params['contractId']

      if (params['contractId']) {
        if (params['requestForDocuments']) {
          this.documentRequest()
        } else {
          this.getScoreModel()
        }
      }
    })
  }
  get loading() {
    return this.dataService.dataIsLoading
  }

  get contractId(): string {
    return this.dataService.contractId
  }

  set contractId(value) {
    this.dataService.contractId = value
  }

  get contractIds(): number[] {
    return this.dataService.contractIds
  }

  get scoreInfoData() {
    return this.dataService.scoreInfoData
  }

  get scoreModel() {
    return this.dataService.scoreModel
  }

  get chosenConditions() {
    return this.dataService.chosenConditions
  }

  get shown() {
    return this.dataService.shown
  }

  get contractPromotion() {
    return this.dataService.contractPromotion
  }

  get clientHistory() {
    return this.dataService.clientHistory
  }

  get pathsOfSending() {
    if (!this.contractPromotion) return []

    let pathsOfSending: { name: string; selected: boolean }[] = [
      { name: 'Електронна пошта', selected: false },
      { name: 'Нова пошта', selected: false },
      { name: 'Укрпошта', selected: false }
    ]

    const paths: string[] = (this.contractPromotion.SendingWays || '').split(', ')
    pathsOfSending.forEach((value) => (value.selected = paths.includes(value.name)))

    return pathsOfSending
  }

  get pathsOfSpecial() {
    let pathsOfSpecial: { name: string; selected: boolean }[] = [{ name: 'Подано не як військовий', selected: false }]

    return pathsOfSpecial
  }

  ngOnDestroy() {
    this.dataService.clearData()
  }

  getScoreModel() {
    this.mode = 'info'
    this.shownContractId = +this.dataService.contractId
    this.dataService.clearData()
    this.dataService.getScoreModel()
    this.dataService.getClientsHistory()
    this.dataService.setCurrencyDictionary()
    this.dataService.findCurrencyId()
  }

  documentRequest() {
    this.mode = 'document'
    this.dataService.documentRequest()
  }

  saveDocumentsRequest() {
    this.dataService.saveDocumentsRequest(() => (this.mode = 'info'))
  }

  contractConfirmed(contr: number) {
    return this.dataService.confirmedChosenConditions
      .map((value) => value.ContractId)
      .concat(this.dataService.excludedContracts)
      .includes(contr)
  }

  getComment(contract: number): string {
    const comments = this.dataService.chosenConditions.filter((val) => val.ContractId === contract)
    if (!comments.length) return ''
    else return comments[0].Comment
  }

  checkIsDocumentAndSendingWay() {
    const isDocuments = this.dataService.confirmedChosenConditions.some((obj) => {
      return (
        obj.WritingOffContract ||
        obj.AssignmentLetter ||
        obj.GuaranteeLetter ||
        obj.Abstract ||
        obj.FactoringContract ||
        obj.AccruingAppendix ||
        obj.Originals
      )
    })
    const isSendingWays = this.dataService.confirmedChosenConditions.some(
      (obj) => obj.SendingWays && obj.SendingWays.length > 0
    )
    return (isDocuments && isSendingWays) || (!isDocuments && !isSendingWays)
  }

  canBeSent() {
    const onlyDocsAllFilled = this.dataService.confirmedChosenConditions
      .filter((value) => value.Type === 'docs_only')
      .map((value) => {
        return dcAdditionalDocsFieldsFilled(value) && !!value.SendingWays
      })
      .every((value) => value)

    const isDocumentAndSendingWay = this.checkIsDocumentAndSendingWay()

    return (
      this.dataService.confirmedChosenConditions.length + this.dataService.excludedContracts.length ===
        this.contractIds.length &&
      onlyDocsAllFilled &&
      isDocumentAndSendingWay
    )
  }

  cantBeSentReason() {
    if (
      this.dataService.confirmedChosenConditions.length + this.dataService.excludedContracts.length !==
      this.contractIds.length
    )
      return 'Не всі договори підтверджені'

    let reason: string[] = []

    const onlyDocsConfirmed = this.dataService.confirmedChosenConditions.filter((value) => value.Type === 'docs_only')

    if (onlyDocsConfirmed.length > 0) {
      if (!onlyDocsConfirmed.map((value) => dcAdditionalDocsFieldsFilled(value)).every((value) => value))
        reason.push('Не для всіх поданих на документи договорів вказані потрібні документи')

      if (!onlyDocsConfirmed.map((value) => !!value.SendingWays).every((value) => value))
        reason.push('Не для всіх поданих на документи договорів обрані способи надсилання')
    }

    return reason.join(';\n')
  }

  chosenIconClass(contr: number) {
    const conditions = this.dataService.confirmedChosenConditions.filter((value) => value.ContractId === contr)
    if (!conditions.length) return ''

    const chosenCondition = conditions[0]
    if (!!chosenCondition.Promotion || chosenCondition.Repeated) return 'bi-check'
    else if (chosenCondition.Type !== 'docs_only') return 'bi-x'
    else return 'bi-book'
  }

  sendInfo() {
    this.dataService.dataIsLoading = true
    // заполнение комментов
    this.dataService.confirmedChosenConditions.forEach((value) => (value.Comment = this.getComment(value.ContractId)))
    // отправка на сервер
    this.httpService.addNewClientPromotion(this.dataService.confirmedChosenConditions).subscribe({
      next: (value) => this.messageService.sendInfo(value.description),
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.dataService.dataIsLoading = false
      },
      complete: () => {
        this.dataService.dataIsLoading = false
        this.contractId = ''
        this.dataService.clearData()
      }
    })
    console.log(this.dataService.confirmedChosenConditions)
  }

  updateAdditionalDocsFields(updatedDocsFields: DcAdditionalDocsFields) {
    this.dataService.contractPromotion = {
      ...this.dataService.contractPromotion!,
      ...updatedDocsFields
    }
  }
}
