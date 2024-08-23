import { Component, EventEmitter, Input, Output, signal } from '@angular/core'
import { DctAbstractDataModel, newTemplateType } from '../../../models/dc-template-models/dct-abstract.data.model'
import { InputInGroupComponent } from '../../../../../shared/components/input-in-group/input-in-group.component'
import { NgFor, NgIf } from '@angular/common'


type TFields = 'ClientSex' | 'FirstCreditor' | 'ClientAddress' | 'ClientName' | 'ClientNameInCase' | 'MilitaryDocType'
type TMilitaryTypes = 'Мобілізований' | 'УБД' | null


@Component({
  selector: 'dct-abstract-confirm-cards',
  templateUrl: './dct-abstract-confirm-cards.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    InputInGroupComponent
  ]
})
export class DctAbstractConfirmCardsComponent {
  readonly militaryTypes = ['Мобілізований', 'УБД', 'відсутні']

  showOtherFields = signal<boolean>(false)

  @Input() abstractData: DctAbstractDataModel[] = []

  @Output() changeTemplate = new EventEmitter<DctAbstractDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

  onDataChange(prom: DctAbstractDataModel) {
    const index = this.abstractData.findIndex(x => x.PromotionId === prom.PromotionId)
    if (index !== -1) {
      this.changeTemplate.emit([
        ...this.abstractData.slice(0, index),
        prom,
        ...this.abstractData.slice(index + 1)
      ])
    }
  }

  onFieldChange(prom: DctAbstractDataModel, field: TFields, value: string) {
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
        let updatedProm: DctAbstractDataModel
        if (value === 'відсутні')
          updatedProm = { ...prom, MilitaryDocType: null }
        else
          updatedProm = { ...prom, MilitaryDocType: value as TMilitaryTypes }
        this.onDataChange({ ...updatedProm, TemplateType: newTemplateType(updatedProm) })
        break
    }
  }

}
