export const recursiveGroupSortByTopLevel = (
  index: string[],
  curLevel: number = 1,
  levelSeparator: string = '|'
) => {
  const finalIndex: string[] = []
  const topLevelIndex = index.filter((key) => key.split(levelSeparator).length === curLevel)
  topLevelIndex.forEach((key) => {
    finalIndex.push(key)
    const subIndex = index.filter((subKey) => subKey.startsWith(key + levelSeparator))
    finalIndex.push(...recursiveGroupSortByTopLevel(subIndex, curLevel + 1))
  })

  return finalIndex
}
