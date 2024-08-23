import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap'
import { DateAdapterForNgbService } from '../../services/date-adapter-for-ngb.service'
import { DateFormatterForNgbService } from '../../services/date-formatter-for-ngb.service'

@Component({
  selector: 'app-date-picker-range-popup',
  templateUrl: './date-picker-range-popup.component.html',
  styleUrls: ['./date-picker-range-popup.component.css'],
  standalone: true,
  imports: [NgbInputDatepicker],
  providers: [
    { provide: NgbDateAdapter, useClass: DateAdapterForNgbService },
    { provide: NgbDateParserFormatter, useClass: DateFormatterForNgbService }
  ]
})
export class DatePickerRangePopupComponent implements OnInit {
  formatter = inject(NgbDateParserFormatter)
  hoveredDate: NgbDate | null = null
  @Input() fromDate: NgbDate | null = null
  @Input() toDate: NgbDate | null = null
  @Input() minDate: NgbDate | null = null
  @Input() maxDate: NgbDate | null = null
  @Input() displayMonths: number = 2
  @Output() dateChanged = new EventEmitter<{ fromDate: NgbDate | null; toDate: NgbDate | null }>()
  startDate: NgbDate | null = null
  private calendar = inject(NgbCalendar)

  ngOnInit() {
    // на всякий случай, если где-то в другом месте сломается
    // if (!this.fromDate)
    //   this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1)
    // if (!this.toDate)
    //   this.toDate = this.calendar.getToday()

    this.startDate = this.toDate ? this.calendar.getPrev(this.toDate, 'm', 1) : null
  }

  onDateSelection(date: NgbDate, datepicker: NgbInputDatepicker) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date
      datepicker.toggle()
    } else {
      this.fromDate = date
      this.toDate = null
    }

    this.dateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate })
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    )
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate)
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    )
  }

  isDisabled(date: NgbDate) {
    return date.before(this.minDate) || date.after(this.maxDate)
  }

  validateInput(currentFromValue: NgbDate | null, currentToValue: NgbDate | null, input: string) {
    const dates: string[] = input.split(/ => /)
    let fromDate: string
    let toDate: string

    if (dates.length === 0) [fromDate, toDate] = [input, '']
    else if (dates.length === 1) [fromDate, toDate] = [dates[0], '']
    else [fromDate, toDate] = dates

    const parsedFromDate = this.formatter.parse(fromDate)
    const parsedToDate = this.formatter.parse(toDate)

    this.fromDate = NgbDate.from(parsedFromDate)
    this.toDate = NgbDate.from(parsedToDate)

    this.dateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate })
  }

  selectAll() {
    this.fromDate = this.minDate ? new NgbDate(this.minDate.year, this.minDate.month, this.minDate.day) : null
    this.toDate = this.maxDate ? new NgbDate(this.maxDate.year, this.maxDate.month, this.maxDate.day) : null

    this.dateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate })
  }
}
