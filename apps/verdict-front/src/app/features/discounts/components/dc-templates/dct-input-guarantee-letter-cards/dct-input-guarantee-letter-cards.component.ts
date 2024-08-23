import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  DctGuaranteeLetterInputDataModel
} from '../../../models/dc-template-models/dct-guarantee-letter-input-data.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dct-input-guarantee-letter-cards',
  templateUrl: './dct-input-guarantee-letter-cards.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CurrencyPipe,
    FormatDatePipe
  ]
})
export class DctInputGuaranteeLetterCardsComponent {
  readonly debtTypes = {
    contract: 'Сума боргу з НКС',
    calculated: 'Сума боргу з 1С',
    register: 'Сума боргу з реєстру - Платежі після відступлення'
  }

  @Input() inputGuaranteeLetterData: DctGuaranteeLetterInputDataModel[] = []

  @Output() changeTemplate = new EventEmitter<DctGuaranteeLetterInputDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

}
