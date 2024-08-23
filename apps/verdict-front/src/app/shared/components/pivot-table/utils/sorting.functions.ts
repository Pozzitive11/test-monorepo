import { datesFilter, numbersFilter } from './filter.functions'
import { TValue } from '../../../models/basic-types'

export const sortNumbers = (values: TValue[], asc: boolean = true) => numbersFilter(values)
  .sort((a, b) => asc ? a - b : b - a)

export const sortDates = (values: TValue[], asc: boolean = true) => datesFilter(values)
  .sort((a, b) => asc ? a.getTime() - b.getTime() : b.getTime() - a.getTime())

export const sortStrings = (values: TValue[], asc: boolean = true) => values
  .map((value) => value ? value.toString() : '')
  .sort((a, b) => {
    if (a === b)
      return 0

    if (asc)
      return a < b ? -1 : 1
    else
      return a > b ? -1 : 1
  })

export const autoSorting = (values: TValue[], asc: boolean = true) => {
  if (values.length === numbersFilter(values).length)
    return sortNumbers(values, asc)
  if (values.length === datesFilter(values).length)
    return sortDates(values, asc)

  return sortStrings(values, asc)
}

export function sortBasedOnIndex<T>(values: T[], index: number[], reverse: boolean = false): T[] {
  if (values.length !== index.length)
    throw new Error('Values and index arrays must have the same length')

  const result = index.map((i) => values[i])

  return reverse ? result.reverse() : result
}

// function sort two-dimensional array (list of columns)
export const sortTableLike = (table: TValue[][], sorting: boolean[], skipFirst: boolean = true): TValue[][] => {
  if (table.length <= 1 || sorting.length === 0)
    return table

  // transform list of columns to list of rows
  table = table[0].map((_, i) => table.map((row) => row[i]))

  const tableCopy = table.map((row) => row.slice())
  let tableIndex = table.map((_, i) => i)
  const sortedTableIndex = tableIndex.sort((a, b) => {
    let i = skipFirst ? 1 : 0
    while (i < sorting.length && tableCopy[a][i] === tableCopy[b][i])
      i++

    if (i === sorting.length)
      return 0

    const leftValue = tableCopy[a][i]
    const rightValue = tableCopy[b][i]

    if (typeof leftValue === 'string' && typeof rightValue === 'string')
      return sorting[i] ? leftValue > rightValue ? 1 : -1 : leftValue < rightValue ? 1 : -1
    else if (typeof leftValue === 'number' && typeof rightValue === 'number')
      return sorting[i] ? leftValue - rightValue : rightValue - leftValue
    else if (leftValue instanceof Date && rightValue instanceof Date)
      return sorting[i] ? leftValue.getTime() - rightValue.getTime() : rightValue.getTime() - leftValue.getTime()
    else if (!!leftValue && !rightValue)
      return sorting[i] ? -1 : 1
    else if (!leftValue && !!rightValue)
      return sorting[i] ? 1 : -1
    else
      return 0
  })

  // transform list of rows to list of columns and return it
  const result = sortedTableIndex.map((i) => table[i])
  return result[0].map((_, i) => result.map((row) => row[i]))
}







