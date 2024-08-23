export interface TextFilterModel {
  not: boolean,
  eq?: string,
  startsWith?: string,
  endsWith?: string,
  includes?: string,
}

export const isTextFilterModel = (filter: any): filter is TextFilterModel => {
  return (
    filter &&
    typeof filter.not === 'boolean' &&
    (filter.eq === undefined || typeof filter.eq === 'string') &&
    (filter.startsWith === undefined || typeof filter.startsWith === 'string') &&
    (filter.endsWith === undefined || typeof filter.endsWith === 'string') &&
    (filter.includes === undefined || typeof filter.includes === 'string')
  )
}
