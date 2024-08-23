export interface NumberFilterModel {
  not: boolean
  eq?: number
  le?: number
  ge?: number
  less?: number
  greater?: number
}

export const isNumberFilterModel = (filter: any): filter is NumberFilterModel => {
  return (
    filter &&
    typeof filter.not === 'boolean' &&
    (filter.eq === undefined || typeof filter.eq === 'number') &&
    (filter.le === undefined || typeof filter.le === 'number') &&
    (filter.ge === undefined || typeof filter.ge === 'number') &&
    (filter.less === undefined || typeof filter.less === 'number') &&
    (filter.greater === undefined || typeof filter.greater === 'number')
  )
}
