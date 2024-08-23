import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IPpVerificationModel } from '../../../models/pp-payment-docs-verification-by-period.model'
import { FormatAnyValuePipe } from '../../../../../shared/pipes/format-any-value.pipe'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'ppv-docs-card',
  templateUrl: './ppv-docs-card.component.html',
  styleUrls: ['./ppv-docs-card.component.css'],
  standalone: true,
  imports: [NgIf, NgbTooltip, NgFor, DecimalPipe, CurrencyPipe, FormatDatePipe, FormatAnyValuePipe]
})
export class PpvDocsCardComponent {
  @Input() verificationData: (IPpVerificationModel | null)[] = []
  @Input() totalData: IPpVerificationModel[] = []
  @Input() title: string = 'Інформація'
  @Input() tooltip: string = ''

  @Output() onPeriodSelect = new EventEmitter<string | null>()

  get totalVerificationCount() {
    return this.verificationData
      .reduce((acc, item) => acc + (item ? item.PaymentsCount : 0), 0)
  }

  get totalVerificationSum() {
    return this.verificationData
      .reduce((acc, item) => acc + (item ? item.PaymentsSum : 0), 0)
  }

  get totalPaymentsCount() {
    return this.totalData.reduce((acc, item) => acc + item.PaymentsCount, 0)
  }

  get totalPaymentsSum() {
    return this.totalData.reduce((acc, item) => acc + item.PaymentsSum, 0)
  }
}
