import { Component, inject, Input } from '@angular/core'
import { CloseConditionsModel } from '../../../models/close-conditions.model'
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { FormsModule } from '@angular/forms'
import { SwitchCheckboxComponent } from '../../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { SumInputComponent } from '../../../../../shared/components/sum-input/sum-input.component'
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-lr-close-conditions-edit',
  templateUrl: './lr-close-conditions-edit.component.html',
  standalone: true,
  imports: [
    NgIf,
    SumInputComponent,
    SwitchCheckboxComponent,
    FormsModule,
    DatePickerPopupComponent,
    DecimalPipe,
    CurrencyPipe
  ]
})
export class LrCloseConditionsEditComponent {
  readonly activeModal = inject(NgbActiveModal)

  @Input() closeConditions!: CloseConditionsModel
  @Input() contractId?: number
  maxMonths: number = 60

  dateLimit() {
    return this.closeConditions.PaymentDateLimit ?
      UtilFunctions.createNgbDate(this.closeConditions.PaymentDateLimit) : null
  }

  dateFirstPayment() {
    return this.closeConditions.RestructuringFirstPayment ?
      UtilFunctions.createNgbDate(this.closeConditions.RestructuringFirstPayment) : null
  }

  setDateLimit(dateLimit: NgbDate | null) {
    this.closeConditions.PaymentDateLimit = !dateLimit ?
      undefined :
      this.closeConditions.PaymentDateLimit = UtilFunctions.ngbDateStructToStringDate(dateLimit)
  }

  setFirstPaymentDate(firstPaymentDate: NgbDate | null) {
    this.closeConditions.RestructuringFirstPayment = !firstPaymentDate ?
      undefined :
      this.closeConditions.RestructuringFirstPayment = UtilFunctions.ngbDateStructToStringDate(firstPaymentDate)
    this.changeRSDates()
  }

  changeRSMonthPayment() {
    if (this.closeConditions.RestructuringMonths && this.closeConditions.RestructuringMonths > 1) {
      if (this.closeConditions.RestructuringMonths === this.maxMonths)
        this.maxMonths++
      this.closeConditions.RestructuringPaymentPerMonth = (
        this.closeConditions.SumToPay / this.closeConditions.RestructuringMonths
      )
    } else {
      this.closeConditions.RestructuringMonths = undefined
      this.closeConditions.RestructuringPaymentPerMonth = undefined
    }

    this.changeRSDates()
  }

  RSApplied() {
    return this.closeConditions.RestructuringMonths && this.closeConditions.RestructuringMonths > 1
  }

  toggleRS(applyRS: boolean) {
    if (applyRS) {
      this.maxMonths = 60
      this.closeConditions.RestructuringMonths = 2
      this.changeRSMonthPayment()
    } else
      this.closeConditions.RestructuringMonths = undefined
  }

  changeSumToPay() {
    if (!this.closeConditions.DiscountPercent) {
      this.closeConditions.DiscountPercent = undefined
      this.closeConditions.SumToPay = this.closeConditions.Debt
      this.changeRSMonthPayment()
      return
    }

    this.closeConditions.SumToPay = (
      this.closeConditions.Debt - (
        this.closeConditions.Debt * this.closeConditions.DiscountPercent / 100
      )
    )
    this.changeRSMonthPayment()
  }

  toggleDC(applyDC: boolean) {
    this.closeConditions.DiscountPercent = applyDC ? 1 : undefined
    this.changeSumToPay()
  }

  changeDCPercent(newSum: number) {
    this.closeConditions.SumToPay = newSum
    this.closeConditions.DiscountPercent = (this.closeConditions.Debt - newSum) / this.closeConditions.Debt * 100
  }

  changeRSDates() {
    if (this.closeConditions.RestructuringFirstPayment && this.closeConditions.RestructuringMonths) {
      this.closeConditions.PaymentDateLimit = new Date(this.closeConditions.RestructuringFirstPayment.valueOf())
      this.closeConditions.PaymentDateLimit.setMonth(
        this.closeConditions.PaymentDateLimit.getMonth() + this.closeConditions.RestructuringMonths
      )
      this.closeConditions.PaymentDateLimit = UtilFunctions.formatDate(
        this.closeConditions.PaymentDateLimit, false, '%Y-%m-%d'
      )
    }
  }
}
