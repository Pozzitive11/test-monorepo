import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {

  transform(inputDate?: Date | string | null, time: boolean = false, ...args: unknown[]): string {
    if (!inputDate)
      return ''

    let date: Date
    if (typeof inputDate === 'string')
      date = new Date(inputDate)
    else
      date = inputDate

    if (date.toString().includes('Invalid'))
      return <string>inputDate

    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const year = date.getFullYear()
    if (!time)
      return `${day}.${month}.${year}`

    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
  }

}
