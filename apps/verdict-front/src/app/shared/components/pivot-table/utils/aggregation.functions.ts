import { datesFilter, numbersFilter } from './filter.functions'
import { PivotNumberAggFunction } from '../models/pivot-table-function.type'
import { TValue } from '../../../models/basic-types'

export const numericAggregationFunctions = {
  sum: (values: TValue[]) => numbersFilter(values).reduce((prev, cur) => prev + cur, 0),
  avg: (values: TValue[]) => numbersFilter(values).reduce((prev, cur) => prev + cur, 0) / values.length,
  min: (values: TValue[]) => Math.min(...numbersFilter(values)),
  max: (values: TValue[]) => Math.max(...numbersFilter(values)),
  redZoneSum: (values: TValue[]) => numbersFilter(values).reduce((prev, cur) => prev + cur, 0)
}
export const numericAggregationDescriptions = {
  sum: 'Сума значень',
  avg: 'Середнє значення',
  min: 'Мінімальне значення',
  max: 'Максимальне значення',
  redZoneSum: 'Червона зона (сума значень)'
}
export const numericAggregationFilterFunctions = {
  sum: (value: TValue, _: TValue[]) => typeof value === 'number',
  avg: (value: TValue, _: TValue[]) => typeof value === 'number',
  min: (value: TValue, groupValues: TValue[]) => (
    typeof value === 'number' && Math.min(...numbersFilter(groupValues)) === value
  ),
  max: (value: TValue, groupValues: TValue[]) => (
    typeof value === 'number' && Math.max(...numbersFilter(groupValues)) === value
  ),
  redZoneSum: (value: TValue, _: TValue[]) => typeof value === 'number'
}

export const lengthAggregationFunctions = {
  count: (values: TValue[]) => values.length,
  countDistinct: (values: TValue[]) => [...new Set(values)].length,
  first: (values: TValue[]) => values[0],
  last: (values: TValue[]) => values[values.length - 1],
  countNotEmpty: (values: TValue[]) => values.filter((value) => !!value).length,
  countEmpty: (values: TValue[]) => values.filter((value) => !value).length,
  redZoneCount: (values: TValue[]) => values.filter((value) => !!value).length
}
export const lengthAggregationDescriptions = {
  count: 'Кількість значень',
  countDistinct: 'Кількість унікальних значень',
  first: 'Перше значення',
  last: 'Останнє значення',
  countNotEmpty: 'Кількість не пустих значень',
  countEmpty: 'Кількість пустих значень',
  redZoneCount: 'Червона зона (кількість не пустих значень)'
}
export const lengthAggregationFilterFunctions = {
  count: (..._: any) => true,
  countDistinct: (value: TValue, groupValues: TValue[]) => (
    groupValues.indexOf(value) === groupValues.lastIndexOf(value)
  ),
  first: (value: TValue, groupValues: TValue[]) => groupValues.indexOf(value) === 0,
  last: (value: TValue, groupValues: TValue[]) => groupValues.lastIndexOf(value) === groupValues.length - 1,
  countNotEmpty: (value: TValue, _: TValue[]) => !!value,
  countEmpty: (value: TValue, _: TValue[]) => !value,
  redZoneCount: (value: TValue, _: TValue[]) => !!value
}

export const dateAggregationFunctions = {
  min: (values: TValue[]) => new Date(Math.min(...datesFilter(values).map((v) => v.getTime()))),
  max: (values: TValue[]) => new Date(Math.max(...datesFilter(values).map((v) => v.getTime())))
}
export const dateAggregationDescriptions = {
  min: 'Мінімальна дата',
  max: 'Максимальна дата'
}
export const dateAggregationFilterFunctions = {
  min: (value: TValue, groupValues: TValue[]) => (
    value instanceof Date && value.getTime() === Math.min(...datesFilter(groupValues).map((v) => v.getTime()))
  ),
  max: (value: TValue, groupValues: TValue[]) => (
    value instanceof Date && value.getTime() === Math.max(...datesFilter(groupValues).map((v) => v.getTime()))
  )
}

export const stringAggregationFactoryFunctions = {
  concat: (sep: string) => (values: TValue[]) => values.join(sep),
  concatDistinct: (sep: string) => (values: TValue[]) => [...new Set(values)].join(sep)
}
export const stringAggregationFactoryDescriptions = {
  concat: 'Конкатенація',
  concatDistinct: 'Конкатенація унікальних'
}
export const stringAggregationFactoryFilterFunctions = {
  concat: (..._: any) => true,
  concatDistinct: (value: TValue, groupValues: TValue[]) => (
    groupValues.indexOf(value) === groupValues.lastIndexOf(value)
  )
}

export const complexAggFunctionFactory = {
  equalsTo: (value: TValue) => {
    return (source: TValue[]) => source.filter((v) => v === value).length
  },
  includedIn: (values: TValue[]) => {
    return (source: TValue[]) => source.filter((v) => values.includes(v)).length
  },
  chainedToPrevious: (previous: boolean, next: PivotNumberAggFunction) => {
    return (source: TValue[]) => previous ? next(source) : 0
  },
  redZone: (days: number) => {
    return (source: TValue[]) => numbersFilter(source).filter((v) => v > days).length
  }
}
export const complexAggFunctionDescriptions = {
  equalsTo: 'Дорівнює',
  includedIn: 'Включається в',
  chainedToPrevious: 'Прив\'язане до попереднього',
  redZone: 'Червона зона'
}
export const complexAggFunctionFilterFunctions = {
  equalsTo: (inputValue: TValue) => (value: TValue, _: TValue[]) => value === inputValue,
  includedIn: (inputValues: TValue[]) => (value: TValue, _: TValue[]) => inputValues.includes(value),
  chainedToPrevious: (previous: boolean, next: PivotNumberAggFunction) => (value: TValue, _: TValue[]) => {
    return previous ? next([value]) > 0 : false
  },
  redZone: (days: number) => (value: TValue, _: TValue[]) => typeof value === 'number' && value > days
}
