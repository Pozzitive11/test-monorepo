export const getHigherLevelNames = (
  tableIndex: string[],
  sep: string,
  tableLevels: number
) => {
  const tableHigherLevels = tableIndex
    .filter((key) => key.split(sep).length < tableLevels || tableLevels === 1)
  const rowsForHigherLevels: { [higherLevel: string]: string[] } = {}
  tableHigherLevels.forEach((higherLevel) => {
    rowsForHigherLevels[higherLevel] = tableIndex
      .filter((key) => key.startsWith(higherLevel + sep) || key === higherLevel)
  })
  return rowsForHigherLevels
}
