import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { TimePlanFactSwitchable } from '../../models/report-models'
import { CcFiltersService } from '../../services/cc-filters.service'
import { Subscription } from 'rxjs'
import { CcTimePlanFactDataService } from '../../services/cc-time-plan-fact-data.service'
import { SegmentationTableSort, sortType } from '../../abstract-classes/segmentation-table-sort.class'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router'
import {
  ProjectComplexFilterComponent
} from '../../components/filters/project-complex-filter/project-complex-filter.component'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import {
  ExcludedLoginsFilterComponent
} from '../../components/filters/take-account-of-filter/excluded-logins-filter.component'
import {
  OneMonthDateFilterComponent
} from '../../components/filters/one-month-date-filter/one-month-date-filter.component'


interface ReportType {
  type: string,
  description: string
}


@Component({
  selector: 'cc-time-plan-fact-page',
  templateUrl: './cc-time-plan-fact-page.component.html',
  standalone: true,
  imports: [
    OneMonthDateFilterComponent,
    ExcludedLoginsFilterComponent,
    NgFor,
    ProjectComplexFilterComponent,
    RouterLink,
    NgbTooltip,
    NgIf,
    LoadingSpinnerComponent,
    DecimalPipe
  ]
})
export class CcTimePlanFactPageComponent extends SegmentationTableSort implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)
  private dataService = inject(CcTimePlanFactDataService)

  reportTypes: ReportType[] = [
    { type: 'З відкритими ВП', description: '' },
    { type: 'Без ВП', description: '' }
  ]

  nonSortedColumns: string[] = []
  sortTypes: sortType[] = []
  loading: boolean = false

  header: string[] = [
    'Проєкт',
    'План по годинах місяць',
    'План по годинах на дату',
    'Факт по годинах на дату',
    'Відхилення на дату',
    '% виконання'
  ]

  reportData: TimePlanFactSwitchable[] = []
  reportData$?: Subscription
  shownData: TimePlanFactSwitchable[] = []
  hiddenRows: string[] = []

  textFilters: string[] = []
  textFilters$?: Subscription

  get isActual(): boolean {
    return this.ccFilters.isActual
  }

  set isActual(isActual) {
    this.ccFilters.isActual = isActual
  }

  constructor() { super() }

  ngOnInit(): void {
    this.loading = true
    this.reportData$ = this.dataService.reportData
      .subscribe(data => {
        this.reportData = data
        if (this.reportData.length === 0)
          this.fillSorting()
        this.updateShownData()
        this.loading = false
      })
    this.textFilters$ = this.ccFilters.textFiltersStream
      .subscribe(filters => {
        this.textFilters = filters
        this.updateShownData()
      })
  }

  ngOnDestroy() {
    this.reportData$?.unsubscribe()
    this.textFilters$?.unsubscribe()
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  allFiltersSelected() {
    return this.dataService.allFiltersSelected()
  }

  allChecked() {
    return this.shownData.every((row) => row.excludeEP)
  }

  checkAll() {
    const checked = this.allChecked()
    this.shownData.forEach((row) => row.excludeEP = !checked)
    const excludedEPProjects: string[] = this.shownData
      .filter(value => value.excludeEP)
      .map(value => value.ProjectName)
    this.dataService.updateData(excludedEPProjects)
  }


  // REPORT STUFF
  updateRow(row: TimePlanFactSwitchable) {
    row.excludeEP = !row.excludeEP
    const excludedEPProjects: string[] = this.shownData
      .filter(value => value.excludeEP)
      .map(value => value.ProjectName)
    this.dataService.updateData(excludedEPProjects)
  }

  get selectedReportTypes() {
    return this.dataService.selectedReportTypes
  }

  toggleReportType(type: string) {
    if (this.dataService.selectedReportTypes.some((value) => value === type))
      this.dataService.selectedReportTypes = this.dataService.selectedReportTypes.filter((value) => value !== type)
    else
      this.dataService.selectedReportTypes.push(type)
  }

  getData() {
    this.loading = true
    this.dataService.getData()
  }

  updateData() {
    this.dataService.updateData()
  }

  updateShownData() {
    const excluded = this.shownData.map(
      (value) => {
        return { excludeEP: value.excludeEP, ProjectName: value.ProjectName }
      }
    )
    for (let exc of excluded) {
      for (let row of this.reportData) {
        if (row.ProjectName === exc.ProjectName) {
          row.excludeEP = exc.excludeEP
          break
        }
      }
    }

    this.shownData = this.reportData
    const textFilters = this.textFilters.filter(value => value !== '')
    if (textFilters.length > 0) {
      this.shownData = this.shownData.filter(
        value => textFilters.some(
          (filter) => value.ProjectName.toLowerCase().includes(filter.toLowerCase())
        )
      )
    }

    for (let sort of this.sortTypes)
      if (!sort.none)
        this.changeSortType(sort.column, false)

  }

  changeSortType(column: string, change: boolean = true): void {
    let curSort: sortType = this.sortTypes.filter(value => value.column === column)[0]
    if (!curSort)
      return

    let left = -1
    let right = 1
    if (change) {
      const leftRight = this.saveSorts(column)
      left = leftRight.right
      right = leftRight.left
    } else if (curSort.down) {
      left = 1
      right = -1
    }

    switch (column) {
      case 'Проєкт':
        this.shownData.sort((a, b) => {
          if (a.ProjectName.includes('Всього')) return 2
          return a.ProjectName > b.ProjectName ? left : right
        })
        break
      case 'План по годинах місяць':
        this.shownData.sort((a, b) => {
          if (a.ProjectName.includes('Всього')) return 2
          return (a.WTimePlan ? a.WTimePlan : 0) < (b.WTimePlan ? b.WTimePlan : 0) ? left : right
        })
        break
      case 'План по годинах на дату':
        this.shownData.sort((a, b) => {
          if (a.ProjectName.includes('Всього')) return 2
          return (a.WTimePlanNow ? a.WTimePlanNow : 0) < (b.WTimePlanNow ? b.WTimePlanNow : 0) ? left : right
        })
        break
      case 'Факт по годинах на дату':
        this.shownData.sort((a, b) => {
          if (a.ProjectName.includes('Всього')) return 2
          return (a.WTimeFact ? a.WTimeFact : 0) < (b.WTimeFact ? b.WTimeFact : 0) ? left : right
        })
        break
      case 'Відхилення на дату':
        this.shownData.sort((a, b) => {
          if (a.ProjectName.includes('Всього')) return 2
          return (a.Deviation ? a.Deviation : 0) < (b.Deviation ? b.Deviation : 0) ? left : right
        })
        break
      case '% виконання':
        this.shownData.sort((a, b) => {
          if (a.ProjectName.includes('Всього')) return 2
          return (a.PRC ? a.PRC : 0) < (b.PRC ? b.PRC : 0) ? left : right
        })
        break
    }
  }
}









