import { FilterModel } from './filter.model'

export interface BasicFilterDataModel {
  col: string,
  filterType: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'mixed' | 'array',
  filter: FilterModel
  sorting: boolean | undefined
}
