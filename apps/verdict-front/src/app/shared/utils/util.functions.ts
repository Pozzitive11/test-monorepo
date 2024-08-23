import { NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { saveAs } from 'file-saver'
import { FilterModel } from '../models/filter.model'
import { HttpResponse } from '@angular/common/http'
import { b64ToUtf8 } from './b64.util'
import { isDictionaryFullModel } from '../models/dictionary-full.model'
import { dateFromString } from './dates.util'
import { tableValueToString } from './transform.utils'

interface CreditInfo {
  token: string
  clientId: string
  filename: string
  pathToFile: string
  contractId: number
  agreementNum: string
  clientName: string
  inn: string
  projectName: string
}

export class UtilFunctions {
  static formatDate(date: Date, time: boolean = false, format?: string): string {
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate()
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
    const year = '' + date.getFullYear()
    const hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()

    if (!format) return time ? `${day}.${month}.${year} ${hours}:${minutes}:${seconds}` : `${day}.${month}.${year}`
    else
      return format
        .replace('%d', day)
        .replace('%m', month)
        .replace('%Y', year)
        .replace('%H', hours)
        .replace('%M', minutes)
        .replace('%S', seconds)
  }

  static isNullToList(match: RegExpMatchArray | null): string[] {
    return match == null ? [''] : match
  }

  static formatNgbDate(date: NgbDate | null, format: string = '%d.%m.%Y'): string {
    if (!date) throw Error('Something wrong happened with the formatDateNgb, somehow we are getting null here')

    const day = (date.day < 10 ? '0' : '') + date.day
    const month = (date.month < 10 ? '0' : '') + date.month
    const year = '' + date.year

    return format.replace('%d', day).replace('%m', month).replace('%Y', year)
  }

  static recreateNgbDate(date: NgbDate | null) {
    if (!date) return date
    else return new NgbDate(date.day, date.month, date.year)
  }

  static createNgbDateFromString(date: string | null, defaultDate?: NgbDate): NgbDate | null {
    if (!date) return null
    const jsDate = dateFromString(date)
    if (!jsDate && defaultDate) return defaultDate
    if (!jsDate) return null

    return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate())
  }

  static createNgbDateFromDate(date: Date | string | null, defaultDate?: Date): NgbDate | null {
    if (!date && !defaultDate) return null

    if (!(date instanceof Date) && typeof date === 'string') date = new Date(date)
    const jsDate = date || defaultDate
    if (!jsDate) return null

    return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate())
  }

  static createNgbDate(date?: string | Date | null, defaultDate?: Date): NgbDate | null {
    if (!date) return null

    if (date instanceof Date) return this.createNgbDateFromDate(date, defaultDate)
    else return this.createNgbDateFromString(date, this.createNgbDateFromDate(defaultDate || null) || undefined)
  }

  static ngbDateFromString(date: string, format?: string): NgbDate {
    // dateNumbers
    const dn: number[] = [...date.matchAll(/\d+/g)].map((value) => +value)
    switch (format) {
      case 'dd.mm.yyyy':
        return new NgbDate(dn[2], dn[1], dn[0])
      default:
        return new NgbDate(dn[0], dn[1], dn[2])
    }
  }

  static ngbDateStructToStringDate(ngbDate: NgbDate): string {
    return this.formatDate(new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day), false, '%Y-%m-%d')
  }

  static ngbDateToDate(ngbDate: NgbDate | null): Date | null {
    if (!ngbDate) return null
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day)
  }

  static getObjectKeys(array: { [key: string]: any }[]): string[] {
    if (array.length === 0) return []
    return Object.keys(array[0]).filter((key) => key !== 'id')
  }

  // NumberFromString
  static nfs(value: string): number {
    const num: number = Number(value.replace(/\s/g, '').replace(/,/, '.'))
    return num ? num : 0
  }

  static formatNumber(value: number | string | undefined, precision: number = 2, formatInt: boolean = true): string {
    if (value === undefined) return ''

    try {
      value = +value
    } catch (e) {
      return ''
    }
    if (value === Math.floor(value)) {
      value = value.toFixed(0)
      if (!formatInt) return value
    } else value = value.toFixed(precision)

    if (!value) return ''

    let number: string = value.replace(/[^\d.,]/g, '')

    let parts = number.split(/[.,]/g)
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
    if (parts.length > 1) parts[1] = parts[1].slice(0, 2)

    return parts.join('.')
  }

  static downloadXlsx(file: Blob, name: string, type: 'dmHM' | 'dmY' | 'dmYHMS' | null = 'dmHM') {
    name = name.replace(/\s*\.xlsx/, '')
    const now = new Date()
    let filename: string
    switch (type) {
      case 'dmHM':
        filename = `${name} ${now.getDate()}${now.getMonth() + 1}_${now.getHours()}${now.getMinutes()}.xlsx`
        break
      case 'dmY':
        filename = `${name} ${this.formatDate(now)}.xlsx`
        break
      case 'dmYHMS':
        filename = `${name} ${this.formatDate(now, true)}.xlsx`
        break
      default:
        filename = `${name}.xlsx`
    }

    saveAs(file, filename)
  }

  static saveFileFromHttp(res: HttpResponse<Blob>, decodeB64: boolean, name?: string) {
    let filename = name || res.headers.get('Content-Disposition')?.split('filename=')[1]
    if (decodeB64) filename = b64ToUtf8(filename || '')
    if (!res.body) throw Error('Не вдалося завантажити файл')

    const filetype = res.headers.get('Content-Type')

    const file = new Blob([res.body], { type: filetype || 'application/octet-stream' })
    saveAs(file, filename)
  }

  static fileFromHttpToBlob(res: HttpResponse<Blob>, decodeB64: boolean, name?: string): [Blob, string | undefined] {
    let filename = name || res.headers.get('Content-Disposition')?.split('filename=')[1]
    if (decodeB64) filename = b64ToUtf8(filename || '')

    if (!res.body) throw Error('Не вдалося завантажити файл')

    const filetype = res.headers.get('Content-Type')

    return [new Blob([res.body], { type: filetype || 'application/octet-stream' }), filename]
  }

  static filterData(partOfData: { [key: string]: any }[], textFilters: { col: string; value: string }[]) {
    for (let filter of textFilters) {
      // * - показать все пустые строки
      // ** - показать все не пустые строки
      if (filter.value === '*') {
        partOfData = partOfData.filter((value) => !value[filter.col])
      } else if (filter.value === '**') {
        partOfData = partOfData.filter((value) => !!value[filter.col])
      } else {
        partOfData = partOfData.filter((value) => String(value[filter.col]).toLowerCase().includes(filter.value))
      }
    }

    return partOfData
  }

  static filterDataExtended(data: { [key: string]: any }[], filters: { col: string; filter: FilterModel }[]) {
    for (let filterInfo of filters) {
      const { col, filter } = filterInfo
      const { not, empty, includes, startsWith, endsWith, eq, le, ge, less, greater } = filter

      if (filter.in && filter.in.length) {
        data = data.filter((value) => filter.in!.includes(tableValueToString(value[col])))
        continue
      }

      const isSupportedArrayType = (value: any) =>
        ['number', 'string'].includes(typeof value) || value === null || value === undefined

      if (empty) {
        const conditionIsTrue = (value: { [key: string]: any }) => {
          if (Array.isArray(value[col])) return value[col].length === 0
          return !value[col]
        }

        data = data.filter((value) => (not ? !conditionIsTrue(value) : conditionIsTrue(value)))
        continue
      }

      if (includes) {
        const conditionIsTrue = (value: { [key: string]: any }) => {
          if (isDictionaryFullModel(value[col])) return value[col].Name.toLowerCase().includes(includes.toLowerCase())
          return String(value[col]).toLowerCase().includes(includes.toLowerCase())
        }
        data = data.filter((value) => (not ? !conditionIsTrue(value) : conditionIsTrue(value)))
      }
      if (startsWith) {
        const conditionIsTrue = (value: { [key: string]: any }) => {
          if (isDictionaryFullModel(value[col]))
            return value[col].Name.toLowerCase().startsWith(startsWith.toLowerCase())
          return String(value[col]).toLowerCase().startsWith(startsWith.toLowerCase())
        }
        data = data.filter((value) => (not ? !conditionIsTrue(value) : conditionIsTrue(value)))
      }
      if (endsWith) {
        const conditionIsTrue = (value: { [key: string]: any }) => {
          if (isDictionaryFullModel(value[col])) return value[col].Name.toLowerCase().endsWith(endsWith.toLowerCase())
          return String(value[col]).toLowerCase().endsWith(endsWith.toLowerCase())
        }
        data = data.filter((value) => (not ? !conditionIsTrue(value) : conditionIsTrue(value)))
      }
      if (eq) {
        const conditionIsTrue = (value: { [key: string]: any }) => {
          if (Array.isArray(value[col])) return value[col].some((val: any) => val == eq)
          else if (isDictionaryFullModel(value[col])) return value[col].Name == eq
          return value[col] == eq
        }
        data = data.filter((value) => (not ? !conditionIsTrue(value) : conditionIsTrue(value)))
      }

      if (le) {
        data = data.filter((value) => {
          if (Array.isArray(value[col])) {
            if (value[col].length > 0 && value[col].every((val: any) => isSupportedArrayType(val)))
              return value[col].some((val: any) => Number(val) <= le)
            else return false
          }

          return value[col] <= le
        })
      }
      if (ge) {
        data = data.filter((value) => {
          if (Array.isArray(value[col])) {
            if (value[col].length > 0 && value[col].every((val: any) => isSupportedArrayType(val)))
              return value[col].some((val: any) => Number(val) >= ge)
            else return false
          }

          return value[col] >= ge
        })
      }
      if (less) {
        data = data.filter((value) => {
          if (Array.isArray(value[col])) {
            if (value[col].length > 0 && value[col].every((val: any) => isSupportedArrayType(val)))
              return value[col].some((val: any) => Number(val) < less)
            else return false
          }

          return value[col] < less
        })
      }
      if (greater) {
        data = data.filter((value) => {
          if (Array.isArray(value[col])) {
            if (value[col].length > 0 && value[col].every((val: any) => isSupportedArrayType(val)))
              return value[col].some((val: any) => Number(val) > greater)
            else return false
          }

          return value[col] > greater
        })
      }
    }

    return data
  }

  static sortData(data: { [key: string]: any }[], sortingFilters: { col: string; ascending: boolean }[]) {
    const isSupportedArrayType = (value: any) =>
      ['number', 'string'].includes(typeof value) || value === null || value === undefined

    for (let filter of sortingFilters) {
      data.sort((a, b) => {
        // SORTING FOR ARRAYS VALUES
        const aIsArray = Array.isArray(a[filter.col])
        const bIsArray = Array.isArray(b[filter.col])
        if (aIsArray && bIsArray) {
          const supportedTypesInA = a[filter.col].some((val: any) => isSupportedArrayType(val))
          const supportedTypesInB = b[filter.col].some((val: any) => isSupportedArrayType(val))

          if (supportedTypesInA && supportedTypesInB) {
            const aMin = Math.min(...a[filter.col].filter((val: any) => isSupportedArrayType(val)))
            const bMin = Math.min(...b[filter.col].filter((val: any) => isSupportedArrayType(val)))
            if (Number.isNaN(aMin) && Number.isNaN(bMin)) return 0
            else if (Number.isNaN(aMin)) return -1
            else if (Number.isNaN(bMin)) return 1

            if (aMin > bMin) return filter.ascending ? 1 : -1
            if (aMin < bMin) return filter.ascending ? -1 : 1
          } else if (supportedTypesInA) return filter.ascending ? 1 : -1
          else if (supportedTypesInB) return filter.ascending ? -1 : 1

          return 0
        } else if (aIsArray) return filter.ascending ? 1 : -1
        else if (bIsArray) return filter.ascending ? -1 : 1

        // SORTING FOR DICTIONARY VALUES
        const aIsDictionary = isDictionaryFullModel(a[filter.col])
        const bIsDictionary = isDictionaryFullModel(b[filter.col])
        if (aIsDictionary && bIsDictionary) {
          if (a[filter.col].Name > b[filter.col].Name) return filter.ascending ? 1 : -1
          if (a[filter.col].Name < b[filter.col].Name) return filter.ascending ? -1 : 1

          return 0
        } else if (aIsDictionary) return filter.ascending ? 1 : -1
        else if (bIsDictionary) return filter.ascending ? -1 : 1

        // SORTING FOR BASIC TYPES VALUES
        if (a[filter.col] > b[filter.col]) return filter.ascending ? 1 : -1
        if (a[filter.col] < b[filter.col]) return filter.ascending ? -1 : 1

        return 0
      })
    }

    return data
  }

  static filterTableData = (partOfData: { [key: string]: any }[], textFilters: { col: string; value: string }[]) => {
    for (let filter of textFilters) {
      // * - показать все пустые строки
      // ** - показать все не пустые строки
      if (filter.value === '*') {
        partOfData = partOfData.filter((value) => !value[filter.col])
      } else if (filter.value === '**') {
        partOfData = partOfData.filter((value) => !!value[filter.col])
      } else {
        partOfData = partOfData.filter((value) => String(value[filter.col]).toLowerCase().includes(filter.value))
      }
    }

    return partOfData
  }

  static uploadDocToDocumentOnline(
    file: File,
    creditInfo: CreditInfo,
    listener: (this: XMLHttpRequest, ev: Event) => any
  ) {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY0MDg3N2Q4LWY1NzAtNDM3Zi1hZTJhLWVkMjU4ZWYxMGRkNCIsIkF1dGhUaW1lIjoiMTIvMDQvMjAxOSAxNDo0NzoyMSIsIm5iZiI6MTU3NTQ3MDg0MSwiZXhwIjoxNzMzMTUwODQxLCJpc3MiOiJodHRwOi8vYXBpLmRvY3VtZW50cy5vbmxpbmUiLCJhdWQiOiJodHRwOi8vYXBpLmRvY3VtZW50cy5vbmxpbmUifQ.yeSfc-LxCdC-LzhhERu_ot3aUh4zvllH-eg00Kph7s4'
    // const clientId = 'ed169af7-e44b-4faa-871d-c7895462cafc'

    const { token, clientId, filename, pathToFile, contractId, agreementNum, clientName, inn, projectName } = creditInfo

    let data = new FormData()
    data.append('testFile', file)
    data.append('Name', filename)
    data.append('Number', `${contractId}`)
    data.append('Path', '3') // Path of document 0 = Default, 1 = Bin, 2 = Task, 3 = Archive, 4 = Package
    data.append('Metadata.Шлях до файлу', pathToFile)
    data.append('Metadata.НКС', `${contractId}`)
    data.append('Metadata.№ договору', agreementNum)
    data.append('Metadata.Боржник', clientName)
    data.append('Metadata.ІПН', inn)
    data.append('Metadata.Проект', projectName)

    let xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4)
    //     console.log(this.responseText)
    // });
    xhr.addEventListener('readystatechange', listener)

    xhr.open('POST', `https://api.document.online/api/v1/${clientId}/document?source=verdict`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Cache-Control', 'no-cache')
    xhr.send(data)
  }

  static daysToString(days: number): string {
    if (days === 0) return ''

    if (days % 10 === 1 && days % 100 !== 11) return `${days} день`
    else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return `${days} дні`
    else return `${days} днів`
  }
}
