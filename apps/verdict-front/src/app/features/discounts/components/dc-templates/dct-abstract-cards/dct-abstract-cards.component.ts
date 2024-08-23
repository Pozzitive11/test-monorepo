import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DctAbstarctInputDataModel } from '../../../models/dc-template-models/dct-abstract-input-data.model'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dct-abstract-cards',
  templateUrl: './dct-abstract-cards.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CurrencyPipe
  ]
})
export class DctInputAbstractCardsComponent {
  readonly debtTypes = {
    contract: 'Сума боргу з НКС',
    calculated: 'Сума боргу з 1С',
    register: 'Сума боргу з реєстру - Платежі після відступлення'
  }

  @Input() inputAbstractData: DctAbstarctInputDataModel[] = []

  @Output() changeTemplate = new EventEmitter<DctAbstarctInputDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

}
