import { Pipe, PipeTransform } from '@angular/core'
import { UtilFunctions } from '../utils/util.functions'

@Pipe({
  name: 'formatAnyValue',
  standalone: true
})
export class FormatAnyValuePipe implements PipeTransform {

  transform(value: any, currency: string | null = null, isPercent: boolean = false, time: boolean = false, formatInt: boolean = true): string {
    if (typeof value === 'number') {
      if (Number.isInteger(value))
        return UtilFunctions.formatNumber(value, 0, formatInt) + (isPercent ? '%' : '') + (currency ? currency : '')

      return UtilFunctions.formatNumber(value, 2) + (isPercent ? '%' : '') + (currency ? currency : '')
    }
    if (typeof value === 'string') {
      const stringIsJSONDate = /^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/.test(value) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3,6}Z?$/.test(value)

      if (stringIsJSONDate)
        return UtilFunctions.formatDate(new Date(value), time)

      return value
    }
    if (value instanceof Date) {
      return UtilFunctions.formatDate(value, time)
    }
    if (typeof value === 'boolean') {
      return value ? '+' : '-'
    }
    if (value === null || value === undefined) {
      return '-'
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    if (Array.isArray(value)) {
      // transform values to strings
      value = value.map((v) => this.transform(v, currency, isPercent, time, formatInt))

      return value.join('; ')
    }

    return typeof value
  }

}
