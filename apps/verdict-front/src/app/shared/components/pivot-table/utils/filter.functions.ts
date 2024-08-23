import { TValue } from '../../../models/basic-types'

export const numbersFilter = (values: TValue[]) => values.filter((value): value is number => typeof value === 'number')
export const datesFilter = (values: TValue[]) => values.filter((value): value is Date => value instanceof Date)
