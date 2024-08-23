import { TValue } from '../../../models/basic-types'

export const pivotValueToString = (value: TValue, emptyReplacer: string = '(пусті)'): string => {
  if (value === null || value === undefined || value === '')
    return emptyReplacer

  if (typeof value === 'number')
    return value.toString()
  if (typeof value === 'string')
    return value
  if (typeof value === 'boolean')
    return value ? 'Так' : 'Ні'
  if (value instanceof Date)
    return value.toLocaleDateString()

  return JSON.stringify(value)
}
