import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core'
import { LoadingBarComponent } from '../loading-bar/loading-bar.component'
import { ModalService } from '../../services/modal.service'
import { BasicFilterDataModel } from '../../models/basic-filter-data.model'
import { TRow, TTable, TValue } from '../../models/basic-types'
import { BasicFilterComponent } from '../basic-filter/basic-filter.component'
import { FilterModel } from '../../models/filter.model'
import { applyFilters, filtersInfo, IFilterDataService } from '../../models/data-service-with-filters.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import { SlicePipe } from '@angular/common'
import { FormatAnyValuePipe } from '../../pipes/format-any-value.pipe'
import { getColumnDataType } from '../../utils/typing.utils'
import { UtilFunctions } from '../../utils/util.functions'
import { PaginationPipe } from '../../pipes/pagination.pipe'
import { MaxPageRowsFilterComponent } from '../max-page-rows-filter/max-page-rows-filter.component'

@Component({
  selector: 'app-table-with-filters',
  standalone: true,
  imports: [
    LoadingBarComponent,
    NgbPagination,
    SlicePipe,
    FormatAnyValuePipe,
    PaginationPipe,
    MaxPageRowsFilterComponent
  ],
  templateUrl: './table-with-filters.component.html',
  styles: ['td { min-width: 100px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableWithFiltersComponent implements IFilterDataService {
  private modalService = inject(ModalService)
  private readonly destroyRef = inject(DestroyRef)

  data = model.required<TTable>()
  idKey = input<string>('id')
  loading = input.required<boolean>()

  rowClick = output<TRow>()
  rowToggle = output<TRow>()
  rowToggleAll = output<void>()

  dataLength = computed(() => this.data().length)

  header = computed(() => this.data().length ? Object.keys(this.data()[0]) : [])

  filteredData = computed(() => {
    return UtilFunctions.sortData(
      UtilFunctions.filterDataExtended(this.data().slice(), this._filters()),
      this._sortingFilters()
    )
  })
  filteredDataLength = computed(() => this.filteredData().length)

  page = signal<number>(1)
  rowsPerPage = model<number>(30)

  private readonly _filters = signal<{ col: string; filter: FilterModel }[]>([])
  get filters() {
    return this._filters()
  }

  set filters(value: { col: string; filter: FilterModel }[]) {
    this._filters.set(value)
  }

  private readonly _sortingFilters = signal<{ col: string; ascending: boolean }[]>([])
  get sortingFilters() {
    return this._sortingFilters()
  }

  set sortingFilters(value: { col: string; ascending: boolean }[]) {
    this._sortingFilters.set(value)
  }

  openFilter(col: string) {
    this.modalService.runModalComponent$<{ data: BasicFilterDataModel, values: TValue[] }, BasicFilterComponent, {
      filter?: FilterModel,
      sorting?: boolean
    }>(
      { data: filtersInfo(col, this), values: this.data().map((row) => row[col]) },
      BasicFilterComponent,
      { centered: true, scrollable: true, size: 'lg' }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newFilters) => applyFilters(col, newFilters, this))
  }

  isFilterApplied(key: string) {
    return (
      this._sortingFilters().filter((value) => value.col === key).length +
      this._filters().filter((value) => value.col === key).length >
      0
    )
  }

  clearFilter(key: string) {
    this._filters.update((filters) => filters.filter((value) => value.col !== key))
    this._sortingFilters.update((sortingFilters) => sortingFilters.filter((value) => value.col !== key))
  }

  isNumber(value: TValue) {
    return typeof value === 'number'
  }

  isLink(value: TValue) {
    return typeof value === 'string' && value.startsWith('http')
  }

  checkDataType(col: string) {
    return getColumnDataType(this.data(), col)
  }

  filterData(): void { }

}
