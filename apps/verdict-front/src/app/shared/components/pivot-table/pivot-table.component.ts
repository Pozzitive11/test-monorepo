import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop'
import { CdkVirtualForOf } from '@angular/cdk/scrolling'
import { CommonModule } from '@angular/common'
import { Component, computed, DestroyRef, effect, EventEmitter, inject, input, Output, signal } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { finalize } from 'rxjs'
import { FormatAnyValuePipe } from '../../pipes/format-any-value.pipe'
import { DisplayTableComponent } from './display-table/display-table.component'
import { PivotTableModel } from './models/pivot-table.model'
import { openFilterModal } from './pivot-filters/open-filter.function'
import { PivotTableService } from './pivot-table.service'
import { filterRowsForHigherLevel } from './utils/filter-rows-for-higher-level.function'
import { getHigherLevelNames } from './utils/get-higher-level-names.function'
import { TableWithFiltersComponent } from '../table-with-filters/table-with-filters.component'
import { TRow, TTable } from '../../models/basic-types'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MessageHandlingService } from '../../services/message-handling.service'
import { CommonOperationsService } from '../../services/common-operations.service'
import { OffcanvasOptionsComponent } from './offcanvas-options/offcanvas-options.component'


@Component({
  selector: 'app-pivot-table',
  standalone: true,
  imports: [
    CommonModule,
    FormatAnyValuePipe,
    NgxSpinnerModule,
    CdkVirtualForOf,
    DisplayTableComponent,
    CdkDrag,
    CdkDropList,
    TableWithFiltersComponent,
    OffcanvasOptionsComponent
  ],
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.css'],
  providers: [CommonOperationsService]
})
export class PivotTableComponent {
  private readonly pivotTableService = inject(PivotTableService)
  private readonly spinner = inject(NgxSpinnerService)
  private readonly modalService = inject(NgbModal)
  private readonly destroy$ = inject(DestroyRef)
  private readonly commonService = inject(CommonOperationsService)
  private readonly messageService = inject(MessageHandlingService)

  reportName = input.required<string>()
  @Output() basicTableViewSelected = new EventEmitter<{ rowName: string, col: string }>()

  basicView = signal<boolean>(false)
  basicViewTab = signal<string | null>(null)
  basicViewData = signal<TTable>([])
  selectedTabs = this.pivotTableService.selectedTabs
  basicViewTabData = computed(() => {
    const basicViewTab = this.basicViewTab()
    const basicViewData = this.basicViewData()
    if (basicViewTab) {
      return this._filterDataByTab(basicViewData, basicViewTab, this.selectedTabs())
    }
    return basicViewData
  })

  displayedTable = this.pivotTableService.displayedTable

  tableIndex = computed(() => Object.keys(this.displayedTable()))
  tableColumns = computed(() => Object.keys(this.displayedTable()[Object.keys(this.displayedTable())[0]]))
  tableHigherLevels = computed(() => {
    return this.tableIndex()
      .filter((key) => key.split(this.sep).length === 1 && key !== this.totalRowName)
      .concat([this.pivotTableService.totalRowKey])
  })
  classesForRedZone = computed(() => this.extractClassesForRedZone(this.displayedTable()))
  redZoneColumns = computed(() => {
    const selectedAliases = this.pivotTableService.selectedAliases()
    const selectedAggFunctions = this.pivotTableService.selectedAggFunctions()

    return this.tableColumns().filter((col) => {
      const colNumber = selectedAliases.indexOf(col)
      return colNumber !== -1 && selectedAggFunctions[colNumber].startsWith('redZone')
    })
  })

  hiddenLevels = signal<string[]>([])
  tableRowNames = computed(() => {
    return filterRowsForHigherLevel(
      getHigherLevelNames(this.tableIndex(), this.sep, this.tableLevels),
      this.hiddenLevels(),
      this.sep
    )
  })

  loading = this.pivotTableService.loading

  get sep() {
    return this.pivotTableService.levelSeparator
  }

  get tableLevels() {
    return this.pivotTableService.tableLevels()
  }

  get firstRowName() {
    return this.pivotTableService.firstRowName()
  }

  get totalRowName() {
    return this.pivotTableService.totalRowKey
  }

  get selectedFilters() {
    return this.pivotTableService.selectedFilterKeys
  }

  get selectedButtonFilters() {
    return this.pivotTableService.selectedButtonFiltersKeys
  }

  get sorting() {
    return this.pivotTableService.pivotTableSorting()
  }

  set sorting(value: { [key: string]: boolean | undefined }) {
    this.pivotTableService.pivotTableSorting.set(value)
  }


  constructor() {
    effect(() => {
      if (this.displayedTable()) {
        setTimeout(() => this.hideAllLevels(), 0)
      }
    }, { allowSignalWrites: true })

    effect(() => {
      if (this.loading())
        setTimeout(() => this.spinner.show(), 0)
      else
        setTimeout(() => this.spinner.hide(), 0)
    })
  }

  updateHiddenLevels(hiddenLevels: string[]) {
    this.hiddenLevels.set(hiddenLevels)
  }

  hideAllLevels() {
    this.updateHiddenLevels(this.tableIndex().filter((name) => name !== this.totalRowName))
  }

  private extractClassesForRedZone(table: PivotTableModel) {
    const classes: { [row: string]: { [col: string]: string } } = {}

    const selectedAliases = this.pivotTableService.selectedAliases()
    const selectedAggFunctions = this.pivotTableService.selectedAggFunctions()
    Object.keys(table).forEach((row) => {
      classes[row] = {}
      Object.keys(table[row]).forEach((col) => {
        if (row === this.pivotTableService.totalRowKey || typeof table[row][col] !== 'number')
          return classes[row][col] = ''

        const colNumber = selectedAliases.indexOf(col)
        if (colNumber === -1)
          return classes[row][col] = ''

        else if (selectedAggFunctions[colNumber].startsWith('redZone') && table[row][col])
          return classes[row][col] = 'red-zone'

        return classes[row][col] = ''
      })
    })

    return classes
  }

  async basicTableView(rowName: string, col: string | null) {
    this.basicView.set(true)
    this.basicViewData.set(await this.pivotTableService.getPartialData(rowName, col))
    const selectedTabs = this.pivotTableService.selectedTabs()
    if (selectedTabs.length > 0) {
      this.basicViewTab.set(selectedTabs[0])
    }
  }

  toExcel() {
    this.pivotTableService.loading.set(true)

    let data: TTable | {
      [sheet: string]: TTable
    } = this.basicView() ? this.basicViewData() : this.pivotTableService.data()

    if (this.pivotTableService.selectedTabs().length) {
      const selectedTabs = this.pivotTableService.selectedTabs()
      data = selectedTabs.reduce((acc, tab) => {
        const sheet = this._filterDataByTab(data as TTable, tab, selectedTabs)
        if (sheet.length > 0) {
          acc[tab] = this._filterDataByTab(data as TTable, tab, selectedTabs)
        }
        return acc
      }, {} as { [sheet: string]: TTable })
    }

    if (Array.isArray(data) && data.length === 0) {
      this.pivotTableService.loading.set(false)
      this.messageService.sendError('Дані відсутні')
      return
    }
    if (!Array.isArray(data) && Object.keys(data).length === 0) {
      this.pivotTableService.loading.set(false)
      this.messageService.sendError('Дані відсутні')
      return
    }

    (
      Array.isArray(data)
        ? this.commonService.dataToExcel$(data, this.reportName())
        : this.commonService.multiTabDataToExcel$(data, this.reportName())
    )
      .pipe(takeUntilDestroyed(this.destroy$), finalize(() => this.pivotTableService.loading.set(false)))
      .subscribe({
        next: () => this.messageService.sendInfo('Дані вивантажено успішно'),
        error: (error) => this.messageService.alertError(error)
      })
  }

  // FILTERS STUFF

  filterIsApplied(column: string) {
    return !!this.pivotTableService.selectedFilters()[column]
  }

  clearFilter(column: string) {
    this.pivotTableService.selectedFilters.update((filters) => {
      delete filters[column]
      return { ...filters }
    })
  }

  openFilter(column: string) {
    this.pivotTableService.openFilter(column)
  }

  async updatePivot() {
    this.pivotTableService.loading.set(true)
    setTimeout(() => this.pivotTableService.createPivotTable(), 0)
  }

  async filterDataByKey(key: string) {
    this.pivotTableService.loading.set(true)
    this.pivotTableService.filterDataByKey(key)
  }

  private _filterDataByTab(basicViewData: TTable, basicViewTab: string, selectedTabs: string[]) {
    return basicViewData
      .filter((row) => row[basicViewTab])
      .map((row) => {
        // remove selectedTabs from rows
        return Object.keys(row).reduce((acc, key) => {
          if (!selectedTabs.includes(key))
            acc[key] = row[key]
          return acc
        }, {} as TRow)
      })
  }
}
