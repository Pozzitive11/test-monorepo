import { UtilFunctions } from './util.functions'

export function dateReviverUtil(key: string, value: any) {
  if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.exec(value)) {
    const date = Date.parse(value)
    if (!isNaN(date))
      return UtilFunctions.formatDate(new Date(value))
  }
  return value
}

