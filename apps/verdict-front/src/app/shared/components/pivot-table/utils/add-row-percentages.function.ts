import { PivotTableModel } from '../models/pivot-table.model'

/*
  * table: { [row: string]: { [col: string]: TValue } }
  *
  * rowPercentagesKeys: [numerator, denominator, columnName]
*/
export const addRowPercentages = (
  table: PivotTableModel,
  rowPercentagesKeys: [string, string, string][]
): PivotTableModel => {
  if (rowPercentagesKeys.length === 0)
    return table

  const result: PivotTableModel = {}

  Object.keys(table).forEach((row) => {
    result[row] = { ...table[row] }
    rowPercentagesKeys.forEach(([numerator, denominator, columnName]) => {
      const numeratorValue = table[row][numerator]
      const denominatorValue = table[row][denominator]
      if (typeof numeratorValue !== 'number' || typeof denominatorValue !== 'number' || denominatorValue === 0) {
        result[row][columnName] = null
        return
      }

      result[row][columnName] = numeratorValue / denominatorValue * 100
    })
  })

  return result
}
