import { Component, inject } from '@angular/core'
import { CcFiltersService } from '../../services/cc-filters.service'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { InputProjectEPReturns } from '../../models/filters.model'
import { ProjectEPReturns } from '../../models/report-models'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { NgFor, NgIf } from '@angular/common'
import { ReestrComponent } from '../../components/filters/reestr/reestr.component'
import { ReestrStatusComponent } from '../../components/filters/reestr-status/reestr-status.component'
import { ReestrTypeComponent } from '../../components/filters/reestr-type/reestr-type.component'
import { InvestProjectComponent } from '../../components/filters/invest-project/invest-project.component'
import { ProjectComponent } from '../../components/filters/project/project.component'
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component'
import { EpBucketFilterComponent } from '../../components/filters/ep-bucket-filter/ep-bucket-filter.component'
import { AgeBucketFilterComponent } from '../../components/filters/age-bucket-filter/age-bucket-filter.component'

@Component({
  selector: 'cc-project-ep-returns-page',
  templateUrl: './cc-project-ep-returns-page.component.html',
  standalone: true,
  imports: [
    AgeBucketFilterComponent,
    EpBucketFilterComponent,
    ProjectManagerComponent,
    ProjectComponent,
    InvestProjectComponent,
    ReestrTypeComponent,
    ReestrStatusComponent,
    ReestrComponent,
    NgIf,
    LoadingSpinnerComponent,
    NgFor
  ]
})
export class CcProjectEpReturnsPageComponent {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  header: string[] = [
    'Проєкт',
    'Віковий бакет',
    'Кількість ІПН',
    'Сума боргу',
    'Тіло',
    'ВП 5',
    'ВП 10',
    'ВП 15',
    'ВП 25',
    'ВП 50',
    'Відкрито ВП',
    'ІПН з RPC',
    'ІПН з PTP',
    'Сума фактичних платежів',
    'Кількість ІПН з фактичними оплатами',
    'Сума платежів ГІС та Віртуальні',
    'Кількість ІПН з платежами ГІС та Віртуальні'
  ]
  loading: boolean = false

  reportData: ProjectEPReturns[] = []
  hiddenRows: number[] = []

  get isInvestProjectOnly(): boolean {
    return this.ccFilters.isInvestProjectOnly
  }

  set isInvestProjectOnly(isInvestProjectOnly) {
    this.ccFilters.isInvestProjectOnly = isInvestProjectOnly
  }

  get isActual(): boolean {
    return this.ccFilters.isActual
  }

  set isActual(isActual) {
    this.ccFilters.isActual = isActual
  }

  getData() {
    this.loading = true

    const input_data: InputProjectEPReturns = {
      Rnumber: this.ccFilters.selectedRnumbers,
      AgeBuckets: this.ccFilters.selectedAgeBuckets,
      IPFilter: this.ccFilters.selectedEPBuckets,
      isInvestProjects: this.isInvestProjectOnly
    }
    this.httpService.getProjectEpReturnsReport(input_data)
      .subscribe({
        next: reportData => {
          this.reportData = reportData
          this.hiddenRows = []
        },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.loading = false
        },
        complete: () => { this.loading = false }
      })
  }

  allFiltersSelected() {
    return this.ccFilters.selectedRnumbers.length > 0
  }

  toggleIsActual() {
    this.isActual = !this.isActual
    this.ccFilters.isActualChanged(this.isActual)
  }

  switchReestrMode() {
    this.isInvestProjectOnly = !this.isInvestProjectOnly

    this.ccFilters.switchReestrMode()
  }

  // PROJECTS STUFF

  getProjectLen(ProjectNum: number): number {
    if (!this.reportData) return 0

    return this.reportData.filter(
      (reportRow) => {
        return reportRow.ProjectNum === ProjectNum && !this.hiddenRows.includes(reportRow.RowNum)
      }
    ).length
  }

  isFirstProjectRow(row: ProjectEPReturns): boolean {
    if (!this.reportData) return false

    const projectRows = this.reportData.filter(
      (reportRow) => {
        return reportRow.ProjectNum === row.ProjectNum && !this.hiddenRows.includes(reportRow.RowNum)
      }
    )
    if (projectRows.length <= 1) return true

    return projectRows[0].RowNum === row.RowNum
  }

  isProjectHidden(ProjectNum: number): boolean {
    if (!this.reportData) return false

    return this.reportData.filter(
      (reportRow) => {
        return reportRow.ProjectNum === ProjectNum && !this.hiddenRows.includes(reportRow.RowNum)
      }
    ).length === 1
  }

  toggleProject(ProjectNum: number) {
    if (!this.reportData) return

    if (this.isProjectHidden(ProjectNum)) {
      let projectRowNums: number[] = []
      for (let row of this.reportData) {
        if (row.ProjectNum === ProjectNum) {
          projectRowNums.push(row.RowNum)
        }
      }
      this.hiddenRows = this.hiddenRows.filter(
        (rowNum) => { return !projectRowNums.includes(rowNum) }
      )
      return
    }

    const projectRows = this.reportData.filter(
      (reportRow) => {
        return reportRow.ProjectNum === ProjectNum
      }
    ).slice(0, -1)

    for (let row of projectRows) {
      this.hiddenRows.push(row.RowNum)
    }
  }

  hideAllProjects() {
    if (!this.reportData) return

    for (let row of this.reportData) {
      if (row.ProjectName.includes('Всього')) continue
      if (!this.isProjectHidden(row.ProjectNum)) this.toggleProject(row.ProjectNum)
    }
  }

  showAllProjects() {
    if (!this.reportData) return

    for (let row of this.reportData) {
      if (row.ProjectName.includes('Всього')) continue
      if (this.isProjectHidden(row.ProjectNum)) this.toggleProject(row.ProjectNum)
    }
  }

  areProjectsHidden(): boolean {
    if (!this.reportData) return false

    for (let row of this.reportData) {
      if (row.ProjectName.includes('Всього')) continue
      if (this.isProjectHidden(row.ProjectNum)) return true
    }

    return false
  }

  getRowValues(row: ProjectEPReturns) {
    let used_values = []
    let excluded = [
      'ProjectName',
      'AgeBucket',
      'ProjectNum',
      'RowNum'
    ]
    const unSelectedEPBuckets = this.ccFilters.EPBucketCols.filter(
      (bucket) => { return !this.ccFilters.selectedEPBuckets.includes(bucket.name) }
    )
    for (let unSelectedEPBucket of unSelectedEPBuckets) excluded.push(unSelectedEPBucket.col)

    const values = Object.values(row)
    const keys = Object.keys(row)
    for (let i = 0; i < values.length; i++) {
      if (!excluded.includes(keys[i])) {
        used_values.push(values[i])
      }
    }
    return used_values
  }

  filterHeader() {
    let excluded: string[] = []
    const unSelectedEPBuckets = this.ccFilters.EPBucketCols.filter(
      (bucket) => { return !this.ccFilters.selectedEPBuckets.includes(bucket.name) }
    )
    for (let unSelectedEPBucket of unSelectedEPBuckets) excluded.push(unSelectedEPBucket.name)

    return this.header.filter(
      (col) => { return !excluded.includes(col) }
    )
  }
}


