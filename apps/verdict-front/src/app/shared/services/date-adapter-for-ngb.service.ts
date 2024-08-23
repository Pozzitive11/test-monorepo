import { Injectable } from '@angular/core'
import { NgbDate, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap'

@Injectable({
  providedIn: 'root'
})
export class DateAdapterForNgbService extends NgbDateAdapter<string> {
  readonly DELIMITER = '.'

  fromModel(value: string | null): NgbDate | null {
    if (value) {
      const date = value.split(this.DELIMITER)
      return new NgbDate(+date[2], +date[1], +date[0])
    }
    return null
  }

  toModel(date: NgbDate | null): string | null {
    if (!date)
      return null

    const day = (date.day < 10 ? '0' : '') + date.day
    const month = (date.month < 10 ? '0' : '') + date.month
    const year = '' + date.year

    return `${day}.${month}.${year}`
  }
}
