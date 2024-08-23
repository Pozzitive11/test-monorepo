import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SegmentationTableSort, sortType } from '../../../abstract-classes/segmentation-table-sort.class'
import { DebtBucketData, DebtDpdPhoneData, SegmentationDebtDpdTableModel } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcSegmentationService } from '../../../services/cc-segmentation.service'
import { CcFiltersService } from '../../../services/cc-filters.service'
import { BucketPipePipe } from '../../../pipes/bucket-pipe.pipe'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive'

type ROW_TYPE =
  'Кількість КД'
  | 'Кількість КД %'
  | 'Тіло'
  | 'Тіло %'
  | 'Outstanding'
  | 'Outstanding %'
  | 'Тіло_avg'
  | 'Outstanding_avg';

@Component({
  selector: 'app-cc-segmentation-debt-dpd-table',
  templateUrl: './cc-segmentation-debt-dpd-table.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgFor, NgbTooltip, NgIf, DecimalPipe, BucketPipePipe]
})
export class CcSegmentationDebtDpdTableComponent extends SegmentationTableSort implements OnInit, OnDestroy {
  private segmentationDataService = inject(CcSegmentationService)
  private ccFilters = inject(CcFiltersService)

  header: string[] = [
    'Проєкт',
    'Наявність актуального телефону',
    'Назва рядків',
    'Бакет суми боргу'
  ]
  nonSortedColumns: string[] = [
    'Наявність актуального телефону',
    'Назва рядків',
    'Бакет суми боргу'
  ]
  dpdBuckets: string[] = []
  debtsBuckets: string[] = []
  allRowTypes = [
    'Кількість КД',
    'Кількість КД %',
    'Тіло',
    'Тіло %',
    'Outstanding',
    'Outstanding %',
    'Тіло_avg',
    'Outstanding_avg'
  ] as const
  selectedRowTypes: ROW_TYPE[] = [
    'Кількість КД',
    'Кількість КД %',
    'Тіло',
    'Тіло %',
    'Тіло_avg'
  ]

  reportData: SegmentationDebtDpdTableModel[] = []
  shownData: SegmentationDebtDpdTableModel[] = []
  reportData$?: Subscription

  sortTypes: sortType[] = []
  sortingBy: ROW_TYPE = 'Кількість КД'

  constructor() { super() }

  ngOnInit(): void {
    this.fillSorting()
    this.reportData$ = this.segmentationDataService.dpdDebtReport
      .subscribe((report) => {
        this.reportData = report
        this.dpdBuckets = this.ccFilters.selectedDPDBuckets
        this.debtsBuckets = this.ccFilters.selectedDebtsBuckets
        this.fillSorting()
        this.updateShownData()
      })
  }

  ngOnDestroy(): void {
    this.reportData$?.unsubscribe()
  }

  getRowTypeTooltip(row: ROW_TYPE) {
    switch (row) {
      case 'Outstanding_avg':
        return 'Середнє значення суми боргу без пені (тіло+відсотки+комісія)'
      case 'Outstanding %':
        return 'Відсоток від значення суми боргу без пені (тіло+відсотки+комісія)'
      case 'Outstanding':
        return 'Суми боргу без пені (тіло+відсотки+комісія)'
      case 'Тіло_avg':
        return 'Середнє значення по тілу'
      case 'Тіло %':
        return 'Відсоток від значення суми по тілу'
      case 'Кількість КД %':
        return 'Відсоток від кількості КД'
    }

    return ''
  }

  getFullHeader() {
    return [...this.header, ...this.dpdBuckets, 'Всього']
  }

  getProperty(column: ROW_TYPE, row: DebtDpdPhoneData): DebtBucketData[] {
    switch (column) {
      case 'Кількість КД':
        return row.data.ContractCount
      case 'Кількість КД %':
        return row.data.ContractCountPercent
      case 'Тіло':
        return row.data.SumDelayBody
      case 'Тіло %':
        return row.data.SumDelayBodyPercent
      case 'Тіло_avg':
        return row.data.BodyAvg
      case 'Outstanding':
        return row.data.Outstanding
      case 'Outstanding %':
        return row.data.OutstandingPercent
      case 'Outstanding_avg':
        return row.data.OutstandingAvg
    }
  }

  override getTooltip(column: string): string {
    if (this.dpdBuckets.includes(column))
      return 'Бакет DPD'
    switch (column) {
      case 'Доля %':
        return 'Відсотки/Outstanding*100'
      case 'Відхилення від середнього значення НКС без телефонів':
        return 'враховуються НКС без жодного актуального телефону'
      default:
        return ''
    }
  }

  override fillSorting() {
    for (let col of [...this.header, ...this.dpdBuckets, 'Всього'])
      this.sortTypes.push({
        column: col,
        none: true,
        down: false,
        up: false
      })
  }

  changeSortType(column: string[][number]): void {
    // Сохраняем тип сортировки
    const leftRight = this.saveSorts(column)
    let left = leftRight.left
    let right = leftRight.right

    // Сортируем
    if (column === 'Проєкт')
      this.shownData.sort((a, b) => {
        if (a.project.includes('Всього')) return 2
        return a.project < b.project ? left : right
      })
    else if ([...this.dpdBuckets, 'Всього'].includes(column)) {
      let index = [...this.dpdBuckets, 'Всього'].indexOf(column)
      this.shownData.sort((a, b) => {
        if (a.project.includes('Всього')) return 2
        return this.calculateSortValue(a, index) > this.calculateSortValue(b, index) ? left : right
      })
    }
  }

  private calculateSortValue(a: SegmentationDebtDpdTableModel, index: number) {
    switch (this.sortingBy) {
      case 'Кількість КД':
        return a.phoneData.slice(-1)[0].data.ContractCount.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Кількість КД %':
        return a.phoneData.slice(-1)[0].data.ContractCountPercent.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Тіло':
        return a.phoneData.slice(-1)[0].data.SumDelayBody.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Тіло %':
        return a.phoneData.slice(-1)[0].data.SumDelayBodyPercent.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Тіло_avg':
        return a.phoneData.slice(-1)[0].data.BodyAvg.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Outstanding':
        return a.phoneData.slice(-1)[0].data.Outstanding.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Outstanding %':
        return a.phoneData.slice(-1)[0].data.OutstandingPercent.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
      case 'Outstanding_avg':
        return a.phoneData.slice(-1)[0].data.OutstandingAvg.reduce(
          (acc, obj) => acc + obj.dpdValues[index], 0
        )
    }
  }

  private updateShownData() {
    this.shownData = this.reportData
  }

  getDigitsInfoForPipe(column: ROW_TYPE): string {
    switch (column) {
      case 'Кількість КД':
        return '1.0-0'
      case 'Кількість КД %':
        return '1.0-2'
      case 'Тіло':
        return '1.0-2'
      case 'Тіло %':
        return '1.0-2'
      case 'Тіло_avg':
        return '1.0-0'
      default:
        return '1.0-2'
    }
  }

  getKeyLength(phoneRow: DebtDpdPhoneData) {
    return phoneRow.data.ContractCount.length
  }

  getProjectLength(projectRow: SegmentationDebtDpdTableModel) {
    return projectRow.phoneData.reduce(
      (acc, obj) => acc + obj.data.ContractCount.length * this.selectedRowTypes.length, 0
    )
  }

  getPhoneDataLength(phoneRow: DebtDpdPhoneData) {
    return phoneRow.data.ContractCount.length * this.selectedRowTypes.length
  }

  // ------------------------------------------------ DROPDOWN STUFF ---------------------------------------------------
  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  toggleSelectedRowTypes(rowType: ROW_TYPE) {
    if (this.selectedRowTypes.includes(rowType))
      this.selectedRowTypes = this.selectedRowTypes.filter((value) => rowType !== value)
    else {
      this.selectedRowTypes = this.allRowTypes.filter(
        (value) => [...this.selectedRowTypes, rowType].includes(value)
      )
    }
  }
}
















