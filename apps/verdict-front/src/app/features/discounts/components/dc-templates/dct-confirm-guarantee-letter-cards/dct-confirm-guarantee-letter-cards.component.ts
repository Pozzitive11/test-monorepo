import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { DctGuaranteeLetterDataModel } from '../../../models/dc-template-models/dct-guarantee-letter-data.model'
import { FormatAnyValuePipe } from '../../../../../shared/pipes/format-any-value.pipe'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { InputInGroupComponent } from '../../../../../shared/components/input-in-group/input-in-group.component'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'


type TFields = 'FirstCreditor' | 'ClientName'

@Component({
  selector: 'dct-confirm-guarantee-letter-cards',
  templateUrl: './dct-confirm-guarantee-letter-cards.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    InputInGroupComponent,
    DatePickerPopupComponent,
    CurrencyPipe,
    FormatDatePipe,
    FormatAnyValuePipe
  ]
})
export class DctConfirmGuaranteeLetterCardsComponent {
  readonly today = UtilFunctions.createNgbDateFromDate(new Date())

  @Input() guaranteeLetterTemplatesData: DctGuaranteeLetterDataModel[] = []

  @Output() changeTemplate = new EventEmitter<DctGuaranteeLetterDataModel[]>()
  @Output() confirmTemplate = new EventEmitter<number>()
  @Output() removeTemplate = new EventEmitter<number>()

  onDataChange(prom: DctGuaranteeLetterDataModel) {
    const index = this.guaranteeLetterTemplatesData.findIndex(x => x.PromotionId === prom.PromotionId)
    if (index !== -1) {
      this.changeTemplate.emit([
        ...this.guaranteeLetterTemplatesData.slice(0, index),
        prom,
        ...this.guaranteeLetterTemplatesData.slice(index + 1)
      ])
    }
  }

  onFieldChange(prom: DctGuaranteeLetterDataModel, field: TFields, value: string) {
    switch (field) {
      case 'FirstCreditor':
        this.onDataChange({ ...prom, FirstCreditor: value })
        break
      case 'ClientName':
        this.onDataChange({ ...prom, ClientName: value })
        break
    }
  }

  toNgbDate(PaymentDateLimit: string | null) {
    return UtilFunctions.createNgbDateFromDate(PaymentDateLimit)
  }

  fromNgbDate(chosenDate: NgbDate | null, prom: DctGuaranteeLetterDataModel) {
    this.onDataChange({
      ...prom,
      PaymentDateLimit: UtilFunctions.formatDate(UtilFunctions.ngbDateToDate(chosenDate) || new Date(), false, '%Y-%m-%d')
    })
  }

}
