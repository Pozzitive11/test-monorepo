import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap'
import { DateFormatterForNgbService } from '../../services/date-formatter-for-ngb.service'
import { DateAdapterForNgbService } from '../../services/date-adapter-for-ngb.service'

@Component({
  selector: 'app-date-picker-popup',
  templateUrl: './date-picker-popup.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: DateAdapterForNgbService },
    { provide: NgbDateParserFormatter, useClass: DateFormatterForNgbService }
  ],
  standalone: true,
  imports: [NgbInputDatepicker]
})
export class DatePickerPopupComponent implements OnInit {
  formatter = inject(NgbDateParserFormatter)
  @Input() chosenDate: NgbDate | null = null
  @Input() minDate: NgbDate | null = null
  @Input() maxDate: NgbDate | null = null
  @Input() disabled: boolean = false
  @Input() fontSize: number = 12
  @Output() chosenDateChange = new EventEmitter<NgbDate | null>()
  private calendar = inject(NgbCalendar)

  ngOnInit(): void {
    if (!this.minDate) this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y', 10)
    if (!this.maxDate) this.maxDate = this.calendar.getNext(this.calendar.getToday(), 'y', 10)
  }

  changeValue(newDate: NgbDate | null) {
    this.chosenDate = newDate
    this.chosenDateChange.emit(newDate)
  }
}
