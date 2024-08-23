import { TextFilterModel } from './text-filter-model'
import { NumberFilterModel } from './number-filter.model'

export const textFilterTypes = {
  empty: 'пусті значення',
  includes: 'містить',
  startsWith: 'починається на',
  endsWith: 'закінчується на',
  eq: 'дорівнює'
}

export const numberFilterTypes = {
  eq: '=',
  le: '<=',
  ge: '>=',
  less: '<',
  greater: '>'
}

export const dateFilterTypes = {
  eq: 'дорівнює',
  le: '<=',
  ge: '>=',
  less: '<',
  greater: '>',
  between: 'між'
}

export type filtersType = TextFilterModel | NumberFilterModel
