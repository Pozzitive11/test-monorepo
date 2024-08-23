import { Component, EventEmitter, Input, Output, signal } from '@angular/core'
import { DctWritingOffDataModel, newTemplateType } from '../../../models/dc-template-models/dct-writing-off-data.model'
import { FormatAnyValuePipe } from '../../../../../shared/pipes/format-any-value.pipe'
import { InputInGroupComponent } from '../../../../../shared/components/input-in-group/input-in-group.component'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'

type TFields = 'ClientSex' | 'FirstCreditor' | 'ClientAddress' | 'ClientName' | 'ClientNameInCase' | 'MilitaryDocType'
type TMilitaryTypes = 'Мобілізований' | 'УБД' | null

@Component({
  selector: 'dct-confirm-cards',
  templateUrl: './dct-confirm-cards.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    DefaultDropdownComponent,
    InputInGroupComponent,
    CurrencyPipe,
    FormatAnyValuePipe
  ]
})
export class DctConfirmCardsComponent {
  readonly militaryTypes = ['Мобілізований', 'УБД', 'відсутні']

  showOtherFields = signal<boolean>(false)

  @Input() writingOffData: DctWritingOffDataModel[] = []


  @Output() changeTemplate = new EventEmitter<DctWritingOffDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

  onDataChange(prom: DctWritingOffDataModel) {
    const index = this.writingOffData.findIndex(x => x.PromotionId === prom.PromotionId)
    if (index !== -1) {
      this.changeTemplate.emit([
        ...this.writingOffData.slice(0, index),
        prom,
        ...this.writingOffData.slice(index + 1)
      ])
    }
  }

  onFieldChange(prom: DctWritingOffDataModel, field: TFields, value: string) {
    switch (field) {
      case 'ClientSex':
        this.onDataChange({ ...prom, ClientSex: value })
        break
      case 'FirstCreditor':
        this.onDataChange({ ...prom, FirstCreditor: value })
        break
      case 'ClientAddress':
        this.onDataChange({ ...prom, ClientAddress: value })
        break
      case 'ClientName':
        this.onDataChange({ ...prom, ClientName: value })
        break
      case 'ClientNameInCase':
        this.onDataChange({ ...prom, ClientNameInCase: value })
        break
      case 'MilitaryDocType':
        let updatedProm: DctWritingOffDataModel
        if (value === 'відсутні')
          updatedProm = { ...prom, MilitaryDocType: null }
        else
          updatedProm = { ...prom, MilitaryDocType: value as TMilitaryTypes }
        this.onDataChange({ ...updatedProm, TemplateType: newTemplateType(updatedProm) })
        break
    }
  }

}
