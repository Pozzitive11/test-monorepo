import { Component, Input } from '@angular/core'
import { AutoObjectModel } from '../../../models/auto-object.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-lr-auto-object-card',
  templateUrl: './lr-auto-object-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    DecimalPipe,
    CurrencyPipe,
    FormatDatePipe
  ]
})
export class LrAutoObjectCardComponent {
  @Input() autoObject!: AutoObjectModel
  hidden: boolean = false
}
