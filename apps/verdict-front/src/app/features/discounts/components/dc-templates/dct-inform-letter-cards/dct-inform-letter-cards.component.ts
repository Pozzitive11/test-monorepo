import { Component, EventEmitter, Input, Output } from '@angular/core'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { DctInformLetterDataModel } from '../../../models/dc-template-models/dct-inform-letter-data.model'
import { FormatAnyValuePipe } from '../../../../../shared/pipes/format-any-value.pipe'
import { DatePickerPopupComponent } from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { InputInGroupComponent } from '../../../../../shared/components/input-in-group/input-in-group.component'
import { NgFor, NgIf } from '@angular/common'

type TFields = 'RefNumber' | 'FirstCreditor' | 'ClientName'

@Component({
  selector: 'dct-inform-letter-cards',
  templateUrl: './dct-inform-letter-cards.component.html',
  standalone: true,
  imports: [NgFor, NgIf, InputInGroupComponent, DatePickerPopupComponent, FormatAnyValuePipe]
})
export class DctInformLetterCardsComponent {
  readonly today = UtilFunctions.createNgbDateFromDate(new Date())

  @Input() informLetterTemplatesData: DctInformLetterDataModel[] = []

  @Output() changeTemplate = new EventEmitter<DctInformLetterDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

  onDataChange(prom: DctInformLetterDataModel) {
    const index = this.informLetterTemplatesData.findIndex((x) => x.PromotionId === prom.PromotionId)
    if (index !== -1) {
      this.changeTemplate.emit([
        ...this.informLetterTemplatesData.slice(0, index),
        prom,
        ...this.informLetterTemplatesData.slice(index + 1)
      ])
    }
  }

  onFieldChange(prom: DctInformLetterDataModel, field: TFields, value: string) {
    switch (field) {
      case 'RefNumber':
        this.onDataChange({ ...prom, RefNumber: value })
        break
      case 'FirstCreditor':
        this.onDataChange({ ...prom, FirstCreditor: value })
        break
      case 'ClientName':
        this.onDataChange({ ...prom, ClientName: value })
        break
    }
  }

  toNgbDate(refNumberDate: Date) {
    return UtilFunctions.createNgbDateFromDate(refNumberDate)
  }

  fromNgbDate(chosenDate: NgbDate | null, prom: DctInformLetterDataModel) {
    this.onDataChange({
      ...prom,
      RefNumberDate: UtilFunctions.ngbDateToDate(chosenDate) || new Date()
    })
  }
}
