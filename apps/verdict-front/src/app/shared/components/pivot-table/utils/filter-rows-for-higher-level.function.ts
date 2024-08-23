export const filterRowsForHigherLevel = (
  rowsForHigherLevels: { [p: string]: string[] },
  hiddenLevels: string[],
  sep: string
) => {
  if (hiddenLevels.length === 0)
    return rowsForHigherLevels

  const filteredRowsForHigherLevels: { [higherLevel: string]: string[] } = {}

  Object.keys(rowsForHigherLevels).forEach((higherLevel) => {
    filteredRowsForHigherLevels[higherLevel] = rowsForHigherLevels[higherLevel]
      .filter((key) => {
        return (
          hiddenLevels
            .filter((name) => {
              return (key.startsWith(name + sep) || key === name) && name.split(sep).length < key.split(sep).length
            })
            .length
        ) === 0
      })
  })

  return filteredRowsForHigherLevels
}
