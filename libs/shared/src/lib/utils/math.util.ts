export const roundNumber = (num: number, precision: number = 2) => {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor + Number.EPSILON) / factor
}
