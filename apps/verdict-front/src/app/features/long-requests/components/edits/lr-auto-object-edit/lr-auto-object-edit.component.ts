import { Component, inject, Input } from '@angular/core'
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { AutoObjectModel } from '../../../models/auto-object.model'
import { LrDataService } from '../../../services/lr-data.service'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { DecimalPipe, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { SumInputComponent } from '../../../../../shared/components/sum-input/sum-input.component'

@Component({
  selector: 'lr-auto-object-edit',
  templateUrl: './lr-auto-object-edit.component.html',
  standalone: true,
  imports: [
    SumInputComponent,
    DatePickerPopupComponent,
    FormsModule,
    NgIf,
    DecimalPipe
  ]
})
export class LrAutoObjectEditComponent {
  readonly activeModal = inject(NgbActiveModal)
  private readonly dataService = inject(LrDataService)

  @Input() autoObject!: AutoObjectModel
  @Input() isMortgage!: boolean

  get contractDebtUAH() {
    if (this.dataService.financialInfo)
      return this.dataService.financialInfo.Debt * this.exchangeRate

    return undefined
  }

  get exchangeRate() {
    if (!this.dataService.financialInfo)
      return 1

    const financialInfo = this.dataService.financialInfo
    return financialInfo.CurrencyExchangeRateCommercial ?
      financialInfo.CurrencyExchangeRateCommercial :
      financialInfo.CurrencyExchangeRate
  }

  get valuationDate() {
    return UtilFunctions.createNgbDate(this.autoObject.ValuationDate || null)
  }

  set valuationDate(date) {
    this.autoObject.ValuationDate = date ? UtilFunctions.ngbDateStructToStringDate(date) : undefined
  }

  updateLTV() {
    if (this.contractDebtUAH && this.autoObject.CostValuation)
      this.autoObject.LTV = (
        this.contractDebtUAH / (this.autoObject.CostValuation * this.exchangeRate) * 100
      )
  }

  updateValuationDate(date: NgbDate | null) {
    this.valuationDate = date
  }
}
