import { Component, Input } from '@angular/core'
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap'
import { DatepickerService } from './datepicker.service'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  standalone: true,
  imports: [NgbDatepicker, NgIf]
})
export class DatepickerComponent {
  @Input() disabled: boolean = false
  hoveredDate: NgbDate | null = null
  today: NgbDate

  fromDate: NgbDate
  toDate: NgbDate | null = null

  constructor(
    calendar: NgbCalendar,
    private datepickerService: DatepickerService
  ) {
    this.today = calendar.getToday()
    this.fromDate = this.datepickerService.fromDate ?
      this.datepickerService.fromDate : calendar.getPrev(calendar.getToday(), 'd', 1)
    this.toDate = this.datepickerService.toDate ?
      this.datepickerService.toDate : calendar.getPrev(calendar.getToday(), 'd', 1)
    this.datepickerService.fromDate = this.fromDate
    this.datepickerService.toDate = this.toDate
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date
    } else {
      this.toDate = null
      this.fromDate = date
    }
    this.datepickerService.fromDate = this.fromDate
    this.datepickerService.toDate = this.toDate
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate)
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date)
  }
}
