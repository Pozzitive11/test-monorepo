import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SegmentationTotalTableModel } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcSegmentationService } from '../../../services/cc-segmentation.service'
import { SegmentationTableSort, sortType } from '../../../abstract-classes/segmentation-table-sort.class'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'


@Component({
  selector: 'app-cc-segmentation-total-table',
  templateUrl: './cc-segmentation-total-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbTooltip,
    DecimalPipe
  ]
})
export class CcSegmentationTotalTableComponent extends SegmentationTableSort implements OnInit, OnDestroy {
  private segmentationDataService = inject(CcSegmentationService)

  header = [
    'Проєкт',
    'Наявність актуального телефону',
    'Кількість КД',
    'Кількість КД % від проєкту',
    'Тіло',
    'Outstanding',
    'Відсотки',
    'Тіло %',
    'Доля %',
    'Тіло_avg',
    'Outstanding_avg',
    'DPD_avg',
    'Відхилення від середнього значення НКС без телефонів'
  ]
  nonSortedColumns = [
    'Наявність актуального телефону'
  ]
  sortTypes: sortType[] = []

  reportData: SegmentationTotalTableModel[] = []
  reportData$: Subscription | undefined

  constructor() { super() }

  ngOnInit(): void {
    this.fillSorting()
    this.reportData$ = this.segmentationDataService.totalReport
      .subscribe((report) => {
        this.reportData = report
        this.fillSorting()
      })
  }

  ngOnDestroy(): void {
    this.reportData$?.unsubscribe()
  }

  changeSortType(column: typeof this.header[number]) {
    // Сохраняем тип сортировки
    const leftRight = this.saveSorts(column)
    let left = leftRight.left
    let right = leftRight.right

    // Сортируем
    switch (column) {
      case 'Проєкт':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.project > b.project ? right : left
        })
        break

      case 'Кількість КД':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.ContractCount > b.phoneData.slice(-1)[0].data.ContractCount ? left : right
        })
        break

      case 'Кількість КД % від проєкту':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.ContractCountProjectPercent > b.phoneData.slice(-1)[0].data.ContractCountProjectPercent ? left : right
        })
        break

      case 'Тіло':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.SumDelayBody > b.phoneData.slice(-1)[0].data.SumDelayBody ? left : right
        })
        break

      case 'Outstanding':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.Outstanding > b.phoneData.slice(-1)[0].data.Outstanding ? left : right
        })
        break

      case 'Відсотки':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.BalancePercent > b.phoneData.slice(-1)[0].data.BalancePercent ? left : right
        })
        break

      case 'Тіло %':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.SumDelayBodyPercent > b.phoneData.slice(-1)[0].data.SumDelayBodyPercent ? left : right
        })
        break

      case 'Доля %':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.DebtPartPercent > b.phoneData.slice(-1)[0].data.DebtPartPercent ? left : right
        })
        break

      case 'Тіло_avg':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.BodyAvg > b.phoneData.slice(-1)[0].data.BodyAvg ? left : right
        })
        break

      case 'Outstanding_avg':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.OutstandingAvg > b.phoneData.slice(-1)[0].data.OutstandingAvg ? left : right
        })
        break

      case 'DPD_avg':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].data.DpdAvg > b.phoneData.slice(-1)[0].data.DpdAvg ? left : right
        })
        break

      case 'Відхилення від середнього значення НКС без телефонів':
        this.reportData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          const aDev = a.phoneData.filter((value) => value.PhonePresence === 'Без телефонів')[0]
          const bDev = b.phoneData.filter((value) => value.PhonePresence === 'Без телефонів')[0]
          if (!aDev || !bDev)
            return 2
          if (!aDev.data.Deviation || !bDev.data.Deviation)
            return 2
          return aDev.data.Deviation > bDev.data.Deviation ? left : right
        })
        break
    }
  }
}
