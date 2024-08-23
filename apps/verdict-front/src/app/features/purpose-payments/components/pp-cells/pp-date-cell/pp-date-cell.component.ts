import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { dateFromString } from '../../../../../shared/utils/dates.util'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'

@Component({
  selector: 'pp-date-cell',
  templateUrl: './pp-date-cell.component.html',
  standalone: true,
  imports: [DatePickerPopupComponent]
})
export class PpDateCellComponent {
  private readonly messageService = inject(MessageHandlingService)

  @Input() value: string = ''

  @Output() valueChange = new EventEmitter<string>()

  get chosenDate(): NgbDate | null {
    if (!this.value)
      return null

    const date = dateFromString(this.value)
    if (!date) {
      this.messageService.sendError(`Формат дати невірний: '${this.value}'`)
      return null
    }
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  set chosenDate(value) {
    if (!value)
      this.value = ''
    else
      this.value = UtilFunctions.formatNgbDate(value)
  }

  updateChosenDate(newValue: NgbDate | null) {
    this.chosenDate = newValue
    this.valueChange.emit(this.value)
  }
}
