import { Component, inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { DcDataService } from '../../services/dc-data.service'
import { DcChosenConditions, DcChosenConditionsPromotions } from '../../models/dc-chosen-conditions'
import { ScoreInfo } from '../../models/dc-basic-models'
import { ClientPromotionInfoModel } from '../../models/dc-client-promotion-info-model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { Subscription } from 'rxjs'
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { SumInputComponent } from '../../../../shared/components/sum-input/sum-input.component'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { FormsModule } from '@angular/forms'
import { DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-dc-main-promotions',
  templateUrl: './dc-main-promotions.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, SwitchCheckboxComponent, NgbTooltip, SumInputComponent, DecimalPipe]
})
export class DcMainPromotionsComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DcDataService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly modalService = inject(NgbModal)

  @Input() contractId!: number
  @Input() scoreInfoData!: ScoreInfo
  @Input() chosenConditionsFull!: DcChosenConditions

  get chosenConditions(): DcChosenConditionsPromotions { return this.chosenConditionsFull.Promotions }

  newChosenCondition$?: Subscription
  additionalDiscountWithRS: boolean = false
  privateAgentPayment: number = 0
  privateAgentPaymentInModal: number = 0

  ngOnInit(): void {
    this.newChosenCondition$ = this.dataService.newChosenCondition$
      .subscribe(value => {
        if (!!value) {
          if (value.contractId === this.contractId)
            if (value.newCondition !== 'StandardDC' && value.newCondition !== 'StandardRS')
              this.chosenConditions.chosen = undefined
        } else
          this.chosenConditions.chosen = undefined
      })
  }

  ngOnDestroy() {
    this.newChosenCondition$?.unsubscribe()
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

    if (value === 'RS')
      this.chosenConditionsFull.LimitDate = this.dataService.calculateRSFinalDate(this.chosenConditions.restructuringMonths)
    else
      this.chosenConditionsFull.LimitDate = this.dataService.calculateDCFinalDate()

    let info: ClientPromotionInfoModel
    switch (value) {
      case 'DC':
        info = {
          Type: 'new',
          Score: this.scoreInfoData.Score,
          Body: this.scoreInfoData.Body,
          ContractId: this.contractId,
          DPD: this.scoreInfoData.DPD,
          Debt: this.scoreInfoData.Debt,
          DiscountPercent: this.chosenConditions.dcType === 'writeOff' ?
            this.scoreInfoData.Discounts.WriteOffPercent :
            100 - this.scoreInfoData.Discounts.BodyPay! / this.scoreInfoData.Debt * 100,
          PrivateAgentPayment: this.privateAgentPayment,
          Military: this.scoreInfoData.Military,
          Promotion: 'Стандарт',
          LimitDate: this.chosenConditionsFull.LimitDate,
          CurrencyId: this.dataService.currencyId,
          ...this.chosenConditionsFull.AdditionalDocsFields
        }
        this.dataService.newChosenCondition$.next({ contractId: this.contractId, newCondition: 'StandardDC' })
        break
      case 'RS':
        if (this.scoreInfoData.Debt / this.chosenConditions.restructuringMonths < this.scoreInfoData.Restructuring.MinPayment) {
          this.messageService.sendError('Обрані умови не відповідають допустимим.')
          return
        }
        info = {
          Type: 'new',
          Score: this.scoreInfoData.Score,
          Body: this.scoreInfoData.Body,
          ContractId: this.scoreInfoData.ContractId,
          DPD: this.scoreInfoData.DPD,
          Debt: this.scoreInfoData.Debt,
          Military: this.scoreInfoData.Military,
          Promotion: 'Стандарт',
          RestructuringMonths: this.chosenConditions.restructuringMonths,
          DiscountPercent: this.additionalDiscountWithRS ? this.getAdditionalDiscountPercent() : undefined,
          LimitDate: this.chosenConditionsFull.LimitDate,
          CurrencyId: this.dataService.currencyId,
          ...this.chosenConditionsFull.AdditionalDocsFields
        }
        this.dataService.newChosenCondition$.next({ contractId: this.contractId, newCondition: 'StandardRS' })
        break
    }

    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions
      .filter(val => val.ContractId !== this.contractId)
    this.dataService.confirmedChosenConditions.push(info)
    this.chosenConditions.chosen = value
  }

  cancelChose() {
    this.chosenConditions.chosen = undefined
    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions
      .filter(val => val.ContractId !== this.contractId)
  }

  getAdditionalDiscountPercent(): number {
    if (this.chosenConditions.restructuringMonths <= 3)
      return 20
    else if (this.chosenConditions.restructuringMonths <= 6)
      return 10
    else
      return 0
  }

  calculateMonthPay() {
    return (
      this.additionalDiscountWithRS ?
        this.scoreInfoData.Debt - this.scoreInfoData.Debt * this.getAdditionalDiscountPercent() / 100 :
        this.scoreInfoData.Debt
    ) / +this.chosenConditions.restructuringMonths
  }

  calculateSumToPay() {
    if (this.chosenConditions.dcType === 'writeOff') {
      return this.scoreInfoData.Debt - this.scoreInfoData.Discounts.WriteOffPercent * this.scoreInfoData.Debt / 100
      // return Math.ceil(
      //   this.scoreInfoData.Debt - this.scoreInfoData.Discounts.WriteOffPercent * this.scoreInfoData.Debt / 100
      // )
    } else if (this.chosenConditions.dcType === 'bodyPay') {
      return this.scoreInfoData.Discounts.BodyPay || 0
    } else {
      const error = `Кто-то забыл добавить новый тип в chosenConditions.dcType: ${this.chosenConditions.dcType}`
      this.messageService.sendError(error)
      throw new Error(error)
    }
  }
}
