import { Component, inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { DcDataService } from '../../services/dc-data.service'
import { ScoreInfo } from '../../models/dc-basic-models'
import { DcChosenConditions, DcChosenConditionsIndividual } from '../../models/dc-chosen-conditions'
import { ClientPromotionInfoModel } from '../../models/dc-client-promotion-info-model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { Subscription } from 'rxjs'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { SumInputComponent } from '../../../../shared/components/sum-input/sum-input.component'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { FormsModule } from '@angular/forms'
import { DecimalPipe, NgIf } from '@angular/common'


@Component({
  selector: 'app-dc-individual-conditions',
  templateUrl: './dc-individual-conditions.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    SwitchCheckboxComponent,
    NgbTooltip,
    SumInputComponent,
    DecimalPipe
  ]
})
export class DcIndividualConditionsComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DcDataService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly modalService = inject(NgbModal)

  @Input() ContractId!: number
  @Input() scoreInfoData!: ScoreInfo
  @Input() chosenConditionsFull!: DcChosenConditions

  writeOff: string = ''
  sumToPay: string = ''

  useSumToPay: boolean = false

  newChosenCondition$?: Subscription
  additionalDiscountWithRS: boolean = false
  privateAgentPayment: number = 0
  privateAgentPaymentInModal: number = 0

  get chosenConditions(): DcChosenConditionsIndividual {
    return this.chosenConditionsFull.Individual
  }

  get discountPercent() {
    return this.chosenConditions.dcType === 'writeOff' ?
      this.chosenConditions.writeOffPercent :
      100 - this.chosenConditions.bodyPayMonths * this.chosenConditions.body / this.scoreInfoData.Debt * 100
  }

  get rsPayment(): number {
    if (!this.chosenConditions.rsMonths)
      return this.chosenConditions.debt

    if (this.useSumToPay)
      return UtilFunctions.nfs(this.sumToPay) / this.chosenConditions.rsMonths

    return (
      this.additionalDiscountWithRS ?
        this.scoreInfoData.Debt - this.scoreInfoData.Debt * this.getAdditionalDiscountPercent() / 100 :
        this.scoreInfoData.Debt
    ) / this.chosenConditions.rsMonths
  }

  ngOnInit(): void {
    this.changeWriteOffPercent()
    this.newChosenCondition$ = this.dataService.newChosenCondition$
      .subscribe(value => {
        if (!!value) {
          if (value.contractId === this.ContractId)
            if (value.newCondition !== 'IndividualDC' && value.newCondition !== 'IndividualRS')
              this.chosenConditions.chosen = undefined
        } else
          this.chosenConditions.chosen = undefined
      })
  }

  ngOnDestroy() {
    this.newChosenCondition$?.unsubscribe()
  }

  calculateSumToPay() {
    if (this.chosenConditions.dcType === 'writeOff')
      return this.chosenConditions.debt - this.chosenConditions.writeOffPercent * this.chosenConditions.debt / 100
    else
      return this.chosenConditions.bodyPayMonths * this.chosenConditions.body
  }

  isPaymentValid() {
    if (this.chosenConditions.dcType === 'writeOff')
      return this.chosenConditions.writeOffPercent > 100 && this.calculateSumToPay() >= this.privateAgentPayment
    else
      return (
        this.chosenConditions.bodyPayMonths * this.chosenConditions.body > this.chosenConditions.debt &&
        this.calculateSumToPay() >= this.privateAgentPayment
      )
  }

  setPrivateAgentPayment(content: TemplateRef<any>) {
    this.privateAgentPaymentInModal = this.privateAgentPayment
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => this.privateAgentPayment = this.privateAgentPaymentInModal,
      () => {}
    )
  }

  choseCondition(value: 'DC' | 'RS') {
    if (this.additionalDiscountWithRS && this.getAdditionalDiscountPercent() === 0)
      this.additionalDiscountWithRS = false

    let info: ClientPromotionInfoModel
    switch (value) {
      case 'DC':
        if (this.chosenConditions.writeOffPercent > 100) {
          this.messageService.sendError('Обрані умови не відповідають допустимим.')
          return
        }
        this.chosenConditionsFull.LimitDate = this.dataService.calculateDCFinalDate()
        info = {
          Type: 'new',
          Score: this.scoreInfoData.Score,
          Body: this.scoreInfoData.Body,
          ContractId: this.scoreInfoData.ContractId,
          DPD: this.scoreInfoData.DPD,
          Debt: this.scoreInfoData.Debt,
          DiscountPercent: this.discountPercent,
          Military: this.scoreInfoData.Military,
          Promotion: 'Індивідуальне',
          LimitDate: this.chosenConditionsFull.LimitDate,
          PrivateAgentPayment: this.privateAgentPayment,
          CurrencyId: this.dataService.currencyId,
          ...this.chosenConditionsFull.AdditionalDocsFields
        }
        this.dataService.newChosenCondition$.next({ contractId: this.ContractId, newCondition: 'IndividualDC' })
        break
      case 'RS':
        if (this.scoreInfoData.Debt / this.chosenConditions.rsMonths < 1) {
          this.messageService.sendError('Обрані умови не відповідають допустимим.')
          return
        }
        this.chosenConditionsFull.LimitDate = this.dataService.calculateRSFinalDate(this.chosenConditions.rsMonths)
        info = {
          Type: 'new',
          Score: this.scoreInfoData.Score,
          Body: this.scoreInfoData.Body,
          ContractId: this.scoreInfoData.ContractId,
          DPD: this.scoreInfoData.DPD,
          Debt: this.scoreInfoData.Debt,
          Military: this.scoreInfoData.Military,
          Promotion: 'Індивідуальне',
          RestructuringMonths: this.chosenConditions.rsMonths,
          DiscountPercent: this.additionalDiscountWithRS ?
            this.getAdditionalDiscountPercent() : (
              this.useSumToPay ? this.discountPercent : undefined
            ),
          LimitDate: this.chosenConditionsFull.LimitDate,
          CurrencyId: this.dataService.currencyId,
          ...this.chosenConditionsFull.AdditionalDocsFields
        }
        this.dataService.newChosenCondition$.next({ contractId: this.ContractId, newCondition: 'IndividualRS' })
        break
    }

    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions
      .filter(val => val.ContractId !== this.ContractId)
    this.dataService.confirmedChosenConditions.push(info)
    this.chosenConditions.chosen = value
  }


  calculateMaxBodyPayMonths(): number {
    return Math.round(this.chosenConditions.debt / this.chosenConditions.body)
  }

  cancelChose() {
    this.chosenConditions.chosen = undefined
    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions
      .filter(val => val.ContractId !== this.ContractId)
  }

  updateSumToPay() {
    this.chosenConditions.writeOffPercent =
      (this.chosenConditions.debt - UtilFunctions.nfs(this.sumToPay)) /
      this.chosenConditions.debt * 100
    this.sumToPay = UtilFunctions.formatNumber(this.sumToPay)
  }

  changeWriteOffPercent() {
    this.writeOff = UtilFunctions.formatNumber('' + (this.chosenConditions.writeOffPercent * this.chosenConditions.debt / 100))
    this.sumToPay = UtilFunctions.formatNumber('' + (this.chosenConditions.debt - this.chosenConditions.writeOffPercent * this.chosenConditions.debt / 100))
  }

  isBodyPayAvailable() {
    return (this.chosenConditions.creditorType === 'МФО' || this.scoreInfoData.Military) && this.scoreInfoData.CanUseNBodyPayment
  }

  getAdditionalDiscountPercent(): number {
    if (this.chosenConditions.rsMonths <= 3)
      return 20
    else if (this.chosenConditions.rsMonths <= 6)
      return 10
    else
      return 0
  }
}


