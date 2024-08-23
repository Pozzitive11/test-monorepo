import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core'

import { Subscription } from 'rxjs'
import { BasicFilterComponent } from '../../../../shared/components/basic-filter/basic-filter.component'
import { applyFilters, filtersInfo } from '../../../../shared/models/data-service-with-filters.model'
import { ProcessTypes } from '../../models/process-types'
import { PpFiltersService } from '../../services/pp-filters.service'
import { PpSpendingCellsService } from '../../services/pp-spending-cells.service'

import { PpTableDataService } from '../../services/pp-table-data.service'
import { CellComponent } from '../cell/cell.component'
import { TableResizeDirective } from '../../../../shared/directives/table-resize.directive'
import { PaymentSplitComponent } from '../payment-split/payment-split.component'
import { CheckBoxComponent } from '../check-box/check-box.component'
import { NgFor, NgIf } from '@angular/common'
import { ModalService } from '../../../../shared/services/modal.service'
import { FilterModel } from '../../../../shared/models/filter.model'
import { BasicFilterDataModel } from '../../../../shared/models/basic-filter-data.model'
import { TValue } from '../../../../shared/models/basic-types'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'


const largeCols = [
  'Варианты',
  'Назначение платежа'
]
const ultraSmallCols = [
  'User',
  'Date',
  'RNumber',
  'Status',
  'Операция',
  'МФО',
  'Код контр.',
  'Номер документа',
  'Валюта',
  'Время пров.'
]
const smallCols = [
  'id',
  'Тип платежа old',
  'Тип платежа проверить',
  'Разбить платёж',
  'Дата проводки',
  'Сумма',
  'Дата документа',
  'Дата архивирования',
  'Ид.Код',
  'Наименование',
  'Source.Name',
  'Наш счет',
  'Счет',
  'МФО банка контр.',
  'Проверка по переуступке',
  'Загружено в базу'
]


@Component({
  selector: 'pp-table',
  templateUrl: './pp-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    CheckBoxComponent,
    PaymentSplitComponent,
    NgFor,
    TableResizeDirective,
    CellComponent
  ]
})
export class PpTableComponent implements OnInit, OnDestroy {
  private readonly filterService = inject(PpFiltersService)
  private readonly dataService = inject(PpTableDataService)
  private readonly modalService = inject(ModalService)
  private readonly spendingCellsService = inject(PpSpendingCellsService)
  private readonly destroyRef = inject(DestroyRef)

  readonly processTypes = ProcessTypes
  readonly debitCol = 'Операция'
  readonly parentTypeCol = 'Батьківська стаття затрат'

  data: { [key: string]: any }[] = []
  header: string[] = []

  columnsWidth: { [name: string]: number } = {}

  // для передачи обновлённых данных
  private dataUpdate$: Subscription | undefined
  // для оповещения о загрузке данных с сервера
  private dataIsReady$: Subscription | undefined

  get dataLength(): number {
    return this.dataService.getData().length
  }

  get processingType() {
    return this.dataService.processType
  }

  ngOnInit(): void {
    this.dataUpdatingSubscription()
    this.dataService.dataIsLoading$.next(true)

    this.spendingCellsService.updateSpendingTypes()
    this.spendingCellsService.updateBusinesses()
    this.spendingCellsService.updateProjects()

    setTimeout(() => this.filterService.filterData())
  }

  ngOnDestroy(): void {
    this.dataUpdate$?.unsubscribe()
    this.dataIsReady$?.unsubscribe()
  }

  getColumnWidth(key: string): number {
    if (this.columnsWidth[key]) return this.columnsWidth[key]
    else if (largeCols.includes(key)) return 400
    else if (smallCols.includes(key)) return 70
    else if (ultraSmallCols.includes(key)) return 50
    return 200
  }

  openFilter(col: string) {
    this.modalService.runModalComponent$<{ data: BasicFilterDataModel, values: TValue[] }, BasicFilterComponent, {
      filter?: FilterModel,
      sorting?: boolean
    }>(
      { data: filtersInfo(col, this.filterService), values: this.dataService.getData().map((row) => row[col]) },
      BasicFilterComponent,
      { centered: true, scrollable: true, size: 'lg' }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newFilters) => applyFilters(col, newFilters, this.filterService))
  }

  // ==================================================================== SUBSCRIPTIONS ================================

  // +
  private dataUpdatingSubscription() {
    this.dataUpdate$ = this.filterService.dataUpdate
      .subscribe({
        next: data => {
          this.data = data
          this.header = this.filterService.header
        }
      })

    this.dataIsReady$ = this.dataService.dataIsReady$
      .subscribe({
        next: () => {
          this.dataService.dataIsLoading$.next(true)
          setTimeout(() => this.filterService.filterData())
        }
      })
  }

  hideCol(col: string) {
    this.dataService.dataIsLoading$.next(true)
    this.filterService.showHideCol(col, false)
    setTimeout(() => this.filterService.filterData())
  }

  isFilterApplied(key: string) {
    return this.filterService.sortingFilters.filter(value => value.col === key).length +
      this.filterService.filters.filter(value => value.col === key).length > 0
  }

  clearFilter(key: string) {
    this.filterService.filters = this.filterService.filters.filter(value => value.col !== key)
    this.filterService.sortingFilters = this.filterService.sortingFilters.filter(value => value.col !== key)

    this.dataService.dataIsLoading$.next(true)
    setTimeout(() => this.filterService.filterData())
  }
}




