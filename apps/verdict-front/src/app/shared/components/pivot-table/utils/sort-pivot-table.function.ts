import { PivotTableModel } from '../models/pivot-table.model'
import { sortTableLike } from './sorting.functions'
import { recursiveGroupSortByTopLevel } from './recursive-group-sort-by-top-level.function'
import { TValue } from '../../../models/basic-types'

export const sortPivotTable = (
  table: PivotTableModel,
  sorting: { [col: string]: boolean | undefined },
  totalRowKey: string = 'Всього'
): PivotTableModel => {
  if (Object.keys(sorting).filter((key) => sorting[key] !== undefined).length === 0 || Object.keys(table).length === 0)
    return table

  let tableToSort: TValue[][] = []
  let sortingValues: boolean[] = []
  tableToSort.push(Object.keys(table).map((key) => key))
  sortingValues.push(true)

  Object.keys(sorting).forEach((col) => {
    if (sorting[col] === undefined)
      return
    tableToSort.push(Object.keys(table).map((key) => table[key][col]))
    sortingValues.push(!!sorting[col])
  })

  const sortedTable = sortTableLike(tableToSort, sortingValues)
  const sortedIndex = recursiveGroupSortByTopLevel(
    (sortedTable[0] as string[]).filter((key) => key !== totalRowKey)
  ).concat([totalRowKey])

  const sortedTableObj: PivotTableModel = {}

  sortedIndex.forEach((key) => sortedTableObj[key] = table[key])

  return sortedTableObj
}
