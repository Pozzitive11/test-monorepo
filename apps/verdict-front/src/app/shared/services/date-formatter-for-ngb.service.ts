import { Injectable } from '@angular/core'
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'


@Injectable({
  providedIn: 'root'
})
export class DateFormatterForNgbService extends NgbDateParserFormatter {
  readonly DELIMITER = '.'

  format(date: NgbDate | null): string {
    if (!date)
      return ''

    const day = (date.day < 10 ? '0' : '') + date.day
    const month = (date.month < 10 ? '0' : '') + date.month
    const year = '' + date.year

    return `${day}.${month}.${year}`
  }

  parse(value: string): NgbDate | null {
    if (value) {
      const date = value.split(this.DELIMITER)
      return new NgbDate(+date[2], +date[1], +date[0])
    }
    return null
  }

}
