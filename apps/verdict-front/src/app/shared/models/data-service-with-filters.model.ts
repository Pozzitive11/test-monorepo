import { FilterModel } from './filter.model'
import { BasicFilterDataModel } from './basic-filter-data.model'

export interface IFilterDataService {
  filters: { col: string, filter: FilterModel }[],
  sortingFilters: { col: string, ascending: boolean }[],
  checkDataType: (col: string) => 'string' | 'number' | 'bigint' | 'boolean' |
    'symbol' | 'undefined' | 'object' | 'function' | 'mixed' | 'array',
  filterData: () => void
}


export const filtersInfo = (col: string, dataService: IFilterDataService): BasicFilterDataModel => {
  const colFilters = dataService.filters
    .filter(value => value.col === col)
    .map(value => value.filter)

  const colSorting = dataService.sortingFilters
    .filter(value => value.col === col)
    .map(value => value.ascending)

  return {
    col,
    filterType: dataService.checkDataType(col),
    filter: colFilters.length ? colFilters[0] : { not: false, empty: false },
    sorting: colSorting.length ? colSorting[0] : undefined
  }
}


export const applyFilters = (
  col: string,
  data: { filter?: FilterModel, sorting?: boolean } | undefined,
  dataService: IFilterDataService
) => {
  if (!data)
    return
  const { filter, sorting } = data

  dataService.filters = dataService.filters.filter(value => value.col !== col)
  if (filter)
    dataService.filters.push({ col, filter })

  dataService.sortingFilters = dataService.sortingFilters.filter(value => value.col !== col)
  if (sorting !== undefined)
    dataService.sortingFilters.push({ col, ascending: sorting })

  dataService.filterData()
}
