import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DctInputWritingOffDataModel } from '../../../models/dc-template-models/dct-input-writing-off-data.model'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'dct-input-cards',
  templateUrl: './dct-input-cards.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CurrencyPipe
  ]
})
export class DctInputCardsComponent {
  readonly debtTypes = {
    contract: 'Сума боргу з НКС',
    calculated: 'Сума боргу з 1С',
    register: 'Сума боргу з реєстру - Платежі після відступлення'
  }

  @Input() inputWritingOffData: DctInputWritingOffDataModel[] = []

  @Output() changeTemplate = new EventEmitter<DctInputWritingOffDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

}
