import { TValue } from '../models/basic-types'

export const tableValueToString = (value: TValue, emptyReplacer: string = '(пусті)'): string => {
  if (typeof value !== 'boolean' && !value) return emptyReplacer

  if (typeof value === 'number') return value.toString()
  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return value ? 'Так' : 'Ні'

  return `${value}`
}

export const generateRandomString = (symbols: number = 16): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: symbols }, () => possible[Math.floor(Math.random() * possible.length)]).join('')
}
