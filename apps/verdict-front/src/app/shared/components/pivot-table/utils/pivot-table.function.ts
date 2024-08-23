import { PivotTableModel, PivotTableTemp } from '../models/pivot-table.model'
import { recursiveGroupSortByTopLevel } from './recursive-group-sort-by-top-level.function'
import { TTable, TValue } from '../../../models/basic-types'

/*
* Pivot table
*
* @param index - columns to be used as index
* @param values - columns to be used as values
* @param aggFunctions - aggregation functions to be applied to values
* @param aliases - alias names for values
* @param filteredData - data to be used for pivot table
* @param levelSeparator - separator for index levels
* @param replaceNull - string to replace null values
* @param totalRowKey - key for total row
* @returns { tableLevels: number, firstRowName: string, sortedFinalTable: PivotTableModel }
*/
export const pivotTableFunction = (
  index: string[],
  values: string[],
  aggFunctions: ((val: TValue[]) => TValue)[],
  aliases: string[],
  filteredData: TTable,
  levelSeparator: string = '|',
  replaceNull: string = '--',
  totalRowKey: string = 'Всього'
) => {
  if (values.length !== aggFunctions.length) {
    throw new Error('Values and aggFunctions must have the same length')
  }
  if (aliases.length > 0 && values.length !== aliases.length) {
    throw new Error('Values and aliases must have the same length')
  }
  if (new Set(aliases).size !== aliases.length) {
    throw new Error('Alias names must be unique')
  }
  if (!filteredData.length) {
    throw new Error('No data to pivot 😅')
  }

  const tableLevels = index.length

  // Total row
  const totalRow: { [key: string]: TValue[] } = {}

  const table: PivotTableTemp = {}
  const finalTable: PivotTableModel = {}

  for (const row of filteredData) {
    for (let j = 0; j < index.length; j++) {
      const groupKey = index
        .slice(0, j + 1)
        .map((key) => row[key] === undefined || row[key] === null ? replaceNull : row[key])
        .join(levelSeparator)

      if (!table[groupKey])
        table[groupKey] = {}
      values.forEach((key, i) => {
        const aliasKey = aliases.length > 0 ? aliases[i] : key
        if (!table[groupKey][aliasKey])
          table[groupKey][aliasKey] = []
        table[groupKey][aliasKey].push(row[key])

        // total row
        if (!totalRow[aliasKey])
          totalRow[aliasKey] = []
        if (j === 0)
          totalRow[aliasKey].push(row[key])
      })
    }
  }
  // присоединение суммарной строки к общей таблице
  table[totalRowKey] = totalRow

  // console.log('table', table)

  Object.keys(table).forEach((groupKey) => {
    Object.keys(table[groupKey]).forEach((aliasKey) => {
      const aggIndex = aliases.length > 0 ? aliases.indexOf(aliasKey) : values.findIndex((v) => v === aliasKey)
      const tableValues = table[groupKey][aliasKey]

      if (!finalTable[groupKey])
        finalTable[groupKey] = {}

      finalTable[groupKey][aliasKey] = aggFunctions[aggIndex](tableValues)
    })
  })

  const indexKeys = Object.keys(finalTable)
  const sortedIndexKeys = recursiveGroupSortByTopLevel(indexKeys)

  const sortedFinalTable: PivotTableModel = {}
  sortedIndexKeys.forEach((key) => sortedFinalTable[key] = finalTable[key])

  const firstRowName = index.join(levelSeparator)

  return {
    tableLevels,
    firstRowName,
    sortedFinalTable
  }
}
