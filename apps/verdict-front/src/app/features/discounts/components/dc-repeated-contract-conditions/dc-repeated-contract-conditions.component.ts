import { Component, inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'
import { ScoreInfo } from '../../models/dc-basic-models'
import { DcChosenConditions } from '../../models/dc-chosen-conditions'
import { ClientPromotionInfoModel } from '../../models/dc-client-promotion-info-model'
import { DcDataService } from '../../services/dc-data.service'
import { SumInputComponent } from '../../../../shared/components/sum-input/sum-input.component'
import { FormsModule } from '@angular/forms'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-dc-repeated-contract-conditions',
  templateUrl: './dc-repeated-contract-conditions.component.html',
  standalone: true,
  imports: [NgIf, SwitchCheckboxComponent, FormsModule, NgbTooltip, SumInputComponent, DecimalPipe]
})
export class DcRepeatedContractConditionsComponent implements OnInit, OnDestroy {
  private readonly modalService = inject(NgbModal)
  private readonly dataService = inject(DcDataService)

  @Input() contractId!: number
  @Input() scoreInfoData!: ScoreInfo
  @Input() chosenConditions!: DcChosenConditions

  readonly fine = 0.1

  newChosenCondition$?: Subscription
  privateAgentPayment: number = 0
  privateAgentPaymentInModal: number = 0

  get sumWithFine() {
    if (this.agreedSum + this.agreedSum * this.fine > this.scoreInfoData.Debt)
      return this.scoreInfoData.Debt
    return this.agreedSum + this.agreedSum * this.fine
  }

  get agreedSum() {
    if (this.scoreInfoData.RestructuringMonthsOld > 0)
      return this.scoreInfoData.AgreedSum - this.scoreInfoData.PaymentsRS
    else
      return this.scoreInfoData.AgreedSum
  }

  get sumToPayDC() {
    // - если была согласована РС => (согласованная сумма + штраф) - дисконт;
    // - если был согласован ДС => согласованная сумма + штраф

    if (this.scoreInfoData.RestructuringMonthsOld > 0 && !this.scoreInfoData.DiscountPercentOld) {
      if (this.agreedSum + this.agreedSum * this.fine - this.discountSum > this.scoreInfoData.Debt)
        return this.scoreInfoData.Debt
      return this.agreedSum + this.agreedSum * this.fine - this.discountSum
    }
    // return Math.ceil(this.sumWithFine - this.discountSum)
    else
      return this.sumWithFine
    // return Math.ceil(this.sumWithFine)
  }

  get discountSum() {
    return this.sumWithFine * this.scoreInfoData.Discounts.WriteOffPercent / 100
  }

  ngOnInit(): void {
    this.newChosenCondition$ = this.dataService.newChosenCondition$
      .subscribe(value => {
        if (!!value) {
          if (value.contractId === this.contractId)
            if (value.newCondition !== 'RepeatedDC' && value.newCondition !== 'RepeatedRS')
              this.chosenConditions.Repeated = undefined
        } else
          this.chosenConditions.Repeated = undefined
      })
  }

  ngOnDestroy() {
    this.newChosenCondition$?.unsubscribe()
  }

  setPrivateAgentPayment(content: TemplateRef<any>) {
    this.privateAgentPaymentInModal = this.privateAgentPayment
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      () => this.privateAgentPayment = this.privateAgentPaymentInModal,
      () => { }
    )
  }

  chose(type: 'DC' | 'RS') {
    if (type === 'RS')
      this.chosenConditions.LimitDate = this.dataService.calculateRSFinalDate(this.chosenConditions.restructuringMonths)
    else
      this.chosenConditions.LimitDate = this.dataService.calculateDCFinalDate()

    this.chosenConditions.Repeated = type
    const info: ClientPromotionInfoModel = {
      Type: 'repeated',
      Repeated: true,
      Score: this.scoreInfoData.Score,
      ContractId: this.contractId,
      Body: this.scoreInfoData.Body,
      Comment: this.chosenConditions.Comment,
      DPD: this.scoreInfoData.DPD,
      Debt: this.scoreInfoData.Debt,
      Military: this.scoreInfoData.Military,
      Promotion: 'Стандарт',
      DiscountPercent: (this.scoreInfoData.Debt - (type === 'RS' ? this.sumWithFine : this.sumToPayDC)) / this.scoreInfoData.Debt * 100,
      PrivateAgentPayment: this.privateAgentPayment,
      RestructuringMonths: type === 'RS' ? this.chosenConditions.restructuringMonths : undefined,
      LimitDate: this.chosenConditions.LimitDate,
      CurrencyId: this.dataService.currencyId,
      ...this.chosenConditions.AdditionalDocsFields
    }

    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions
      .filter(val => val.ContractId !== this.contractId)
    this.dataService.confirmedChosenConditions.push(info)
    this.dataService.newChosenCondition$.next({ contractId: this.contractId, newCondition: `Repeated${type}` })
  }

  cancel() {
    this.chosenConditions.Repeated = undefined
    this.dataService.confirmedChosenConditions = this.dataService.confirmedChosenConditions
      .filter(val => val.ContractId !== this.contractId)
  }
}
