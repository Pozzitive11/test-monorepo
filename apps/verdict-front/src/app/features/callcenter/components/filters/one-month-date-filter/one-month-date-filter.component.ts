import { Component, inject, OnInit } from '@angular/core'
import { NgbCalendar, NgbDate, NgbDatepicker, NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap'
import { DatepickerService } from '../../../../../shared/components/datepicker/datepicker.service'
import { CcFiltersService } from '../../../services/cc-filters.service'

@Component({
  selector: 'app-one-month-date-filter',
  templateUrl: './one-month-date-filter.component.html',
  standalone: true,
  imports: [NgbDatepicker]
})
export class OneMonthDateFilterComponent implements OnInit {
  private calendar = inject(NgbCalendar)
  private datepickerService = inject(DatepickerService)
  private ccFilters = inject(CcFiltersService)

  hoveredDate: NgbDate | null = null
  yesterday: NgbDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 1)

  fromDate: NgbDate = this.datepickerService.fromDate ?
    this.datepickerService.fromDate : new NgbDate(this.calendar.getToday().year, this.calendar.getToday().month, 1)
  toDate: NgbDate | null = this.datepickerService.toDate ? this.datepickerService.toDate : this.yesterday

  ngOnInit(): void {
    this.ccFilters.updateExcludedLogins(this.fromDate.year, this.fromDate.month)
    this.datepickerService.fromDate = this.fromDate
    this.datepickerService.toDate = this.toDate
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date
      if (this.fromDate.month !== this.toDate.month) {
        this.fromDate = new NgbDate(this.toDate.year, this.toDate.month, 1)
      }
    } else {
      this.toDate = null
      this.fromDate = date
    }

    this.ccFilters.updateExcludedLogins(this.fromDate.year, this.fromDate.month)
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

  onMonthSelection($event: NgbDatepickerNavigateEvent) {
    const nextMonth = $event.next.month
    const nextYear = $event.next.year

    if (nextMonth * nextYear !== this.yesterday.year * this.yesterday.month) {
      this.fromDate = new NgbDate(nextYear, nextMonth, 1)
      this.toDate = this.calendar.getPrev(this.calendar.getNext(this.fromDate, 'm', 1), 'd', 1)
    } else {
      this.fromDate = new NgbDate(this.calendar.getToday().year, this.calendar.getToday().month, 1)
      this.toDate = this.yesterday
    }

    this.ccFilters.updateExcludedLogins(this.fromDate.year, this.fromDate.month)
    this.datepickerService.fromDate = this.fromDate
    this.datepickerService.toDate = this.toDate
  }
}
