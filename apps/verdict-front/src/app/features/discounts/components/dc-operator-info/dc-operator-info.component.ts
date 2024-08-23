import { Component, inject, Input, OnInit } from '@angular/core'
import { DcDataService } from '../../services/dc-data.service'
import { ScoreInfo, ScoreModel } from '../../models/dc-basic-models'
import { DcChosenConditions, Shown } from '../../models/dc-chosen-conditions'
import { ClientPromotionInfoModel } from '../../models/dc-client-promotion-info-model'
import {
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker,
  NgbPopover,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap'
import { DateAdapterForNgbService } from '../../../../shared/services/date-adapter-for-ngb.service'
import { DateFormatterForNgbService } from '../../../../shared/services/date-formatter-for-ngb.service'
import { DcAdditionalDocsFields } from '../../models/dc-additional-docs-fields'
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe'
import { DcClientHistoryComponent } from '../dc-client-history/dc-client-history.component'
import { DcAdditionalDocsForClientReqComponent } from '../dc-additional-docs-for-client-req/dc-additional-docs-for-client-req.component'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { FormsModule } from '@angular/forms'
import { DcIndividualConditionsComponent } from '../dc-individual-conditions/dc-individual-conditions.component'
import { DcMainPromotionsComponent } from '../dc-main-promotions/dc-main-promotions.component'
import { DcRepeatedContractConditionsComponent } from '../dc-repeated-contract-conditions/dc-repeated-contract-conditions.component'
import { DcAdditionalSpecialConfComponent } from '../dc-additional-special-conf/dc-additional-special-conf.component'
import { DcOtherDocsUploadComponent } from '../dc-other-docs-upload/dc-other-docs-upload.component'
import { DcmDocUploadComponent } from '../dc-military/dcm-doc-upload/dcm-doc-upload.component'
import { DcIdentificationDocsUploadComponent } from '../dc-identification-docs-upload/dc-identification-docs-upload.component'
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'
import { DatePickerPopupComponent } from '../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { DcmDocUploadWithTypesComponent } from '../dc-military/dcm-doc-upload-with-types/dcm-doc-upload-with-types.component'
import { DcMilitaryDocsDataService } from '../../services/dc-military-docs-data.service'

@Component({
  selector: 'app-dc-operator-info',
  templateUrl: './dc-operator-info.component.html',
  styles: [
    `
      table {
        color: #084298;
      }

      table tr {
        border-bottom: #0f1c51 solid 0.01rem;
      }

      table td:last-child {
        text-align: right;
      }

      .table > :not(caption) > * > * {
        color: #084298;
        background-color: transparent;
      }
    `
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: DateAdapterForNgbService },
    { provide: NgbDateParserFormatter, useClass: DateFormatterForNgbService }
  ],
  standalone: true,
  imports: [
    NgIf,
    NgbTooltip,
    DcIdentificationDocsUploadComponent,
    DcmDocUploadComponent,
    DcOtherDocsUploadComponent,
    DcAdditionalSpecialConfComponent,
    NgbPopover,
    NgFor,
    DcRepeatedContractConditionsComponent,
    DcMainPromotionsComponent,
    DcIndividualConditionsComponent,
    FormsModule,
    NgbInputDatepicker,
    DefaultDropdownComponent,
    DcAdditionalDocsForClientReqComponent,
    DcClientHistoryComponent,
    DecimalPipe,
    CurrencyPipe,
    FormatDatePipe,
    DatePickerPopupComponent,
    DcmDocUploadWithTypesComponent
  ]
})
export class DcOperatorInfoComponent implements OnInit {
  private readonly dataService = inject(DcDataService)
  protected militaryDataService = inject(DcMilitaryDocsDataService)

  @Input() ContractId!: number
  @Input() scoreInfoData!: ScoreInfo
  @Input() scoreModel!: ScoreModel
  @Input() chosenConditions!: DcChosenConditions
  @Input() shown!: Shown
  @Input() clientHistory: { [key: string]: any }[] = []

  denyReasons: string[] = ['APTP іншого оператора', 'Не поданий']
  pathsOfSending: { name: string; selected: boolean }[] = [
    { name: 'Електронна пошта', selected: false },
    { name: 'Нова пошта', selected: false },
    { name: 'Укрпошта', selected: false }
  ]

  pathsOfSpecial: { name: string; selected: boolean }[] = [{ name: 'Подано не як військовий', selected: false }]
  ngOnInit(): void {
    this.militaryDataService.setMilitaryDocTree()
    this.militaryDataService.setMilitaryDocTreeData()
  }
  get chosenReason() {
    if (!this.chosenConditions.DocsOnly)
      return this.chosenConditions.DenyReason ? this.chosenConditions.DenyReason : 'Не подавати'

    return 'Тільки документи'
  }

  showPromotions() {
    this.shown.promotions = !this.shown.promotions
    this.shown.individual = false
    this.shown.repeated = false
    this.shown.history = false
  }

  showIndividual() {
    this.shown.individual = !this.shown.individual
    this.shown.promotions = false
    this.shown.repeated = false
    this.shown.history = false
  }

  showRepeated() {
    this.shown.repeated = !this.shown.repeated
    this.shown.promotions = false
    this.shown.individual = false
    this.shown.history = false
  }

  showHistory() {
    this.shown.history = !this.shown.history
    this.shown.promotions = false
    this.shown.individual = false
    this.shown.repeated = false
  }

  cancelDenyContract() {
    this.chosenConditions.DocsOnly = undefined
    this.chosenConditions.Denied = false
    this.chosenConditions.DenyReason = ''
    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions.filter(
      (val) => val.ContractId !== this.ContractId
    )
  }

  denyContract(denyReason: string) {
    this.dataService.newChosenCondition$.next({ contractId: this.ContractId, newCondition: undefined })
    this.chosenConditions.DenyReason = denyReason
    this.chosenConditions.Denied = true
    const info: ClientPromotionInfoModel = {
      Type: this.scoreInfoData.TempStopList ? 'repeated_denied' : 'denied',
      Score: this.scoreInfoData.Score,
      ContractId: this.ContractId,
      DenyReason: denyReason,
      Body: this.scoreInfoData.Body,
      Comment: this.chosenConditions.Comment,
      DPD: this.scoreInfoData.DPD,
      Debt: this.scoreInfoData.Debt,
      Military: this.scoreInfoData.Military,
      LimitDate: this.chosenConditions.LimitDate,
      CurrencyId: this.dataService.currencyId,
      ...this.chosenConditions.AdditionalDocsFields
    }
    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions.filter(
      (val) => val.ContractId !== this.ContractId
    )
    this.dataService.confirmedChosenConditions.push(info)
  }

  requestDocs() {
    this.chosenConditions.DocsOnly = true
    this.dataService.newChosenCondition$.next({ contractId: this.ContractId, newCondition: undefined })
    this.chosenConditions.Denied = true
    const info: ClientPromotionInfoModel = {
      Type: 'docs_only',
      Score: this.scoreInfoData.Score,
      ContractId: this.ContractId,
      Body: this.scoreInfoData.Body,
      Comment: this.chosenConditions.Comment,
      DPD: this.scoreInfoData.DPD,
      Debt: this.scoreInfoData.Debt,
      Military: this.scoreInfoData.Military,
      LimitDate: this.chosenConditions.LimitDate,
      CurrencyId: this.dataService.currencyId,
      ...this.chosenConditions.AdditionalDocsFields
    }
    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions.filter(
      (val) => val.ContractId !== this.ContractId
    )
    this.dataService.confirmedChosenConditions.push(info)
  }

  updateLimitDate(chosenDate: NgbDate | null) {
    if (!chosenDate) return
    for (const row of this.dataService.confirmedChosenConditions) {
      if (row.ContractId === this.ContractId) {
        row.LimitDate = UtilFunctions.formatDate(UtilFunctions.ngbDateToDate(chosenDate)!, false, '%d.%m.%Y')
        this.chosenConditions.LimitDate = row.LimitDate
      }
    }
  }

  updateAdditionalDocsFields(additionalDocsFields: DcAdditionalDocsFields) {
    this.chosenConditions.AdditionalDocsFields = additionalDocsFields
    let newRow
    for (let row of this.dataService.confirmedChosenConditions) {
      if (row.ContractId === this.ContractId) {
        newRow = { ...row, ...additionalDocsFields }
        break
      }
    }

    if (!!newRow) {
      this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions.filter(
        (val) => val.ContractId !== this.ContractId
      )
      this.dataService.confirmedChosenConditions.push(newRow)
    }
  }

  inAgreementProcess() {
    // НКС подан ранее, но ещё не согласован
    return (
      !this.scoreInfoData.TempStopList &&
      !this.scoreInfoData.EternalStopList &&
      (this.scoreInfoData.RestructuringMonthsOld > 0 || this.scoreInfoData.AgreedSum > 0)
    )
  }

  toNgbDate(paymentDateLimit: string | null) {
    if (!paymentDateLimit) return null
    return UtilFunctions.ngbDateFromString(paymentDateLimit, 'dd.mm.yyyy')
  }
}
