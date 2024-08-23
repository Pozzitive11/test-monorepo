import { FilterModel } from '../../../shared/models/filter.model'

export interface PpLayoutModel {
  name: string
  hiddenCols: string[] | null
  sortingFilters: { col: string, ascending: boolean }[] | null
  filters: { col: string, filter: FilterModel }[] | null
  showUnex: boolean | null
}
