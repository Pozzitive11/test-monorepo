import { computed, inject, Injectable, signal } from '@angular/core'
import { MessageHandlingService } from '../../services/message-handling.service'
import { finalize, Observable, of, take } from 'rxjs'
import { PivotTableModel } from './models/pivot-table.model'
import {
  lengthAggregationDescriptions,
  lengthAggregationFilterFunctions,
  lengthAggregationFunctions,
  numericAggregationDescriptions,
  numericAggregationFilterFunctions,
  numericAggregationFunctions
} from './utils/aggregation.functions'
import { pivotValueToString } from './utils/transform.functions'
import { pivotTableFunction } from './utils/pivot-table.function'
import { sortPivotTable } from './utils/sort-pivot-table.function'
import { TTable, TValue } from '../../models/basic-types'
import { IPivotConfig } from './models/pivot-table-config.model'
import { pleaseMakeSomethingBetter } from './utils/please-make-smth-better'
import { openFilterModal } from './pivot-filters/open-filter.function'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

type TAggFunctions = { [key: string]: (val: TValue[]) => TValue }
type TAggFunctionsReverse = { [key: string]: (val: TValue, gVal: TValue[]) => boolean }
type TStringMap = { [key: string]: string }
type TAggFunctionSet = {
  aggFunctions: TAggFunctions
  aggFunctionsDescriptions: TStringMap
  aggFunctionsReverse: TAggFunctionsReverse
}

@Injectable({
  providedIn: 'root'
})
export class PivotTableService {
  private readonly messageService = inject(MessageHandlingService)
  private readonly modalService = inject(NgbModal)

  readonly totalRowKey = 'Всього'
  readonly levelSeparator: string = '|'
  readonly replaceNull: string = '--'

  pivotTableSorting = signal<{ [col: string]: boolean | undefined }>({})
  pivotTable = signal<PivotTableModel>({})
  displayedTable = computed(() => sortPivotTable(this.pivotTable(), this.pivotTableSorting(), this.totalRowKey))
  loading = signal<boolean>(false)
  data = signal<TTable>([])
  valueTypes = signal<{ [col: string]: string[] }>({})
  tableLevels = signal<number>(0)
  firstRowName = signal<string>('***')

  selectedValues = signal<string[]>([])
  selectedIndex = signal<string[]>([])
  selectedFilterKeys = signal<string[]>([])
  selectedFilters = signal<{ [key: string]: string[] }>({})
  selectedButtonFiltersKeys = signal<string[]>([])
  selectedAggFunctions = signal<string[]>([])
  selectedAliases = signal<string[]>([])
  selectedTabs = signal<string[]>([])

  aggFunctions = signal<TAggFunctions>({
    ...numericAggregationFunctions,
    ...lengthAggregationFunctions
  })
  aggFunctionsDescriptions = signal<TStringMap>({
    ...numericAggregationDescriptions,
    ...lengthAggregationDescriptions
  })
  aggFunctionsReverse = signal<TAggFunctionsReverse>({
    ...numericAggregationFilterFunctions,
    ...lengthAggregationFilterFunctions
  })

  get pivotConfig(): Omit<IPivotConfig, 'name'> {
    return {
      selectedValues: this.selectedValues(),
      selectedIndex: this.selectedIndex(),
      selectedFilterKeys: this.selectedFilterKeys(),
      selectedAggFunctions: this.selectedAggFunctions(),
      selectedAliases: this.selectedAliases(),
      selectedFilters: this.selectedFilters(),
      selectedSorting: this.pivotTableSorting(),
      selectedTabs: this.selectedTabs()
    }
  }

  setPivotConfig(config: Partial<IPivotConfig>) {
    this.selectedValues.set(config.selectedValues || [])
    this.selectedIndex.set(config.selectedIndex || [])
    this.selectedFilterKeys.set(config.selectedFilterKeys || [])
    this.selectedAggFunctions.set(config.selectedAggFunctions || [])
    this.selectedAliases.set(config.selectedAliases || [])
    this.selectedFilters.set(config.selectedFilters || {})
    this.selectedTabs.set(config.selectedTabs || [])
    this.pivotTableSorting.set(config.selectedSorting || {})
  }

  resetAggFunctions(additionalFunctions?: TAggFunctionSet) {
    this.aggFunctions.set({
      ...numericAggregationFunctions,
      ...lengthAggregationFunctions,
      ...(additionalFunctions?.aggFunctions || {})
    })
    this.aggFunctionsDescriptions.set({
      ...numericAggregationDescriptions,
      ...lengthAggregationDescriptions,
      ...(additionalFunctions?.aggFunctionsDescriptions || {})
    })
    this.aggFunctionsReverse.set({
      ...numericAggregationFilterFunctions,
      ...lengthAggregationFilterFunctions,
      ...(additionalFunctions?.aggFunctionsReverse || {})
    })
  }

  loadData(dataObserver: Observable<TTable>) {
    this.loading.set(true)

    dataObserver
      .pipe(take(1), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          if (data.length) {
            const columns = Object.keys(data[0])
            const valueTypes = { ...this.valueTypes() }
            columns.forEach((key) => (valueTypes[key] = []))

            data.forEach((row) => {
              columns.forEach((col) => {
                const valueType = row[col] instanceof Date ? 'Date' : typeof row[col]
                if (!valueTypes[col].includes(valueType)) valueTypes[col].push(valueType)
              })
            })
            this.valueTypes.set(valueTypes)
          }
          this.data.set(data)
          this.createPivotTable()
        },
        error: (err) => this.messageService.alertError(err)
      })
  }

  /**
   * Filters data
   *
   * @param column - column to be excluded from filtering
   * @returns filtered data
   */
  filterData(column: string | null) {
    const selectedFilters = this.selectedFilters()
    const filterKeys = Object.keys(selectedFilters).filter((key) => key !== column)

    return this.data().filter((row) => {
      return filterKeys.every((key) => {
        return selectedFilters[key].includes(pivotValueToString(row[key]))
      })
    })
  }

  createPivotTable() {
    if (!this.data().length) {
      this.loading.set(false)
      return
    }

    // Pivot table
    const index: string[] = this.selectedIndex()
    const values: string[] = this.selectedValues()
    const aggFunctions: ((val: TValue[]) => TValue)[] = this.selectedAggFunctions().map((key) => this.aggFunctions()[key])
    const aliases: string[] = this.selectedAliases()
    let pivot: { tableLevels: number; firstRowName: string; sortedFinalTable: PivotTableModel }
    try {
      pivot = pivotTableFunction(
        index,
        values,
        aggFunctions,
        aliases,
        this.filterData(null),
        this.levelSeparator,
        this.replaceNull,
        this.totalRowKey
      )
      this.tableLevels.set(pivot.tableLevels)
      this.firstRowName.set(pivot.firstRowName)
    } catch (e) {
      this.messageService.sendError('Помилка при побудові зведеної таблиці. Перевірте вибрані значення та фільтри')
      this.loading.set(false)
      return
    }

    this.pivotTable.set(pivot.sortedFinalTable)
    this.loading.set(false)
  }

  resetPivotTable() {
    this.pivotTable.set({})
    this.loadData(of([]))

    this.setPivotConfig({})
    this.resetAggFunctions()
  }

  getColumnType(column: string) {
    const valueTypes = this.valueTypes()
    if (valueTypes[column].includes('number')) return 'number'
    if (valueTypes[column].includes('Date')) return 'Date'

    return 'string'
  }

  async getPartialData(rowName: string, alias: string | null) {
    const groupValues = rowName.split(this.levelSeparator)
    const selectedAliases = this.selectedAliases()
    const selectedValues = this.selectedValues()
    const column = selectedValues.find((key, index) =>
      selectedAliases.length > 0 ? selectedAliases[index] === alias : key === alias
    )

    const selectedIndex = this.selectedIndex()
    const selectedGroupData = this.filterData(null).filter((row) => {
      return (
        rowName === this.totalRowKey ||
        groupValues.every((value, i) => {
          return pivotValueToString(row[selectedIndex[i]]) === value || (value === this.replaceNull && !row[selectedIndex[i]])
        })
      )
    })

    if (!column) {
      return selectedGroupData
    }

    const selectedAggFunctions = this.selectedAggFunctions()
    const funcToCheckAgainst = this.aggFunctionsReverse()[selectedAggFunctions[selectedValues.indexOf(column)]]

    const columnValues = selectedGroupData.map((row) => row[column])

    return selectedGroupData.filter((row) => funcToCheckAgainst(row[column], columnValues))
  }

  filterDataByKey(key: string) {
    this.selectedFilters.set(pleaseMakeSomethingBetter(key, this.data()))
    this.createPivotTable()
  }

  openFilter(column: string, updatePivot = true) {
    const callback = (newFilters: string[]) => {
      this.selectedFilters.update((selectedFilters) => {
        if (newFilters?.length)
          selectedFilters[column] = newFilters
        else
          delete selectedFilters[column]
        return { ...selectedFilters }
      })

      if (updatePivot) {
        this.loading.set(true)
        setTimeout(() => this.createPivotTable(), 0)
      }
    }

    openFilterModal(
      column,
      this.modalService,
      this.filterData(column).map((row) => row[column]),
      this.selectedFilters()[column] || [],
      callback
    )
  }
}
