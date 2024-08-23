import { Injectable } from '@angular/core'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap'

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  fromDate: NgbDate | null = null
  toDate: NgbDate | null = null

  getFromDate(): Date {
    let fromDate = new Date()
    if (!!this.fromDate)
      fromDate = new Date(Date.UTC(
        this.fromDate.year,
        this.fromDate.month - 1,
        this.fromDate.day
      ))
    return fromDate
  }

  getToDate(): Date {
    let toDate = new Date()
    if (!!this.toDate) toDate = new Date(Date.UTC(
      this.toDate.year,
      this.toDate.month - 1,
      this.toDate.day
    ))
    return toDate
  }
}


