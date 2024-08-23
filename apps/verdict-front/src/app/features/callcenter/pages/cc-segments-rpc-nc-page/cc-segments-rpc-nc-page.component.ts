import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SegmentsRPCNC } from '../../models/report-models'
import { CcFiltersService } from '../../services/cc-filters.service'
import { CcSegmentsRpcNcDataService } from '../../services/cc-segments-rpc-nc-data.service'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { DatepickerService } from '../../../../shared/components/datepicker/datepicker.service'
import { NgbCalendar, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import {
  CcSegmentsRpcNcTotalInfoBoxComponent
} from '../../components/report-tables/cc-segments-rpc-nc-total-info-box/cc-segments-rpc-nc-total-info-box.component'
import { ReestrComponent } from '../../components/filters/reestr/reestr.component'
import { ReestrStatusComponent } from '../../components/filters/reestr-status/reestr-status.component'
import { ReestrTypeComponent } from '../../components/filters/reestr-type/reestr-type.component'
import { InvestProjectComponent } from '../../components/filters/invest-project/invest-project.component'
import { ProjectComponent } from '../../components/filters/project/project.component'
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component'

@Component({
  selector: 'cc-segments-rpc-nc-page',
  templateUrl: './cc-segments-rpc-nc-page.component.html',
  standalone: true,
  imports: [
    ProjectManagerComponent,
    ProjectComponent,
    InvestProjectComponent,
    ReestrTypeComponent,
    ReestrStatusComponent,
    ReestrComponent,
    CcSegmentsRpcNcTotalInfoBoxComponent,
    NgIf,
    LoadingSpinnerComponent,
    NgbProgressbar,
    NgFor,
    DecimalPipe
  ]
})
export class CcSegmentsRpcNcPageComponent implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)
  private dataService = inject(CcSegmentsRpcNcDataService)
  private router = inject(Router)
  private datepickerService = inject(DatepickerService)
  private calendar = inject(NgbCalendar)

  loading: boolean = false
  updating: boolean = false

  segments: SegmentsRPCNC[] = []
  segmentsTotal: SegmentsRPCNC[] = []
  segments$?: Subscription
  segmentsTotal$?: Subscription

  hiddenRows: { position: string, project: string }[] = []
  hiddenPositions: { position: string, project: string }[] = []


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

  get isTotal(): boolean {
    return this.dataService.isTotal
  }

  set isTotal(isTotal) {
    this.dataService.isTotal = isTotal
  }

  ngOnInit(): void {
    this.segments$ = this.dataService.segments
      .subscribe(segments => {
        this.segments = segments
        this.loading = false
      })

    this.segmentsTotal$ = this.dataService.segmentsTotal
      .subscribe(segments => {
        this.segmentsTotal = segments
        this.loading = false
      })
  }

  ngOnDestroy() {
    this.segments$?.unsubscribe()
    this.segmentsTotal$?.unsubscribe()
  }

  get header() {
    return this.dataService.header
  }

  get maxLevel() {
    return this.dataService.maxLevel
  }

  getData() {
    this.loading = true

    this.dataService.getData(this.isInvestProjectOnly)
  }

  allFiltersSelected() {
    return this.ccFilters.selectedRnumbers.length > 0
  }

  getMargin(level: number): string {
    return `padding-left: ${level + 0.5}rem`
  }

  toggleRow(project: string, position: string, level: number) {
    const segments = this.isTotal ? this.segmentsTotal : this.segments

    if (this.hiddenPositions.filter(
      (value) => value.position === position && value.project === project
    ).length > 0) {
      let filteredSegments = segments.filter(
        (segment) => segment.underPosition === position && segment.project === project
      )
      for (let segment of filteredSegments) {
        this.hiddenRows = this.hiddenRows.filter(
          (pos) => pos.position !== segment.position || pos.project !== segment.project
        )
      }
      this.hiddenPositions = this.hiddenPositions.filter(
        (item) => { return item.position !== position || item.project !== project }
      )
      return
    }

    let lastPositions: { position: string, project: string }[] = [{ position: position, project: project }]

    while (level < this.dataService.maxLevel) {
      let newPositions = lastPositions
      lastPositions = []

      if (newPositions.length === 0)
        break

      for (let pos of newPositions) {
        this.hiddenPositions.push({ position: pos.position, project: pos.project })
        let filteredSegments = segments.filter(
          (segment) => segment.underPosition === pos.position && segment.project === pos.project
        )
        if (filteredSegments.length === 0)
          continue

        level = filteredSegments[0].level
        for (let segment of filteredSegments) {
          if (!this.hiddenRows.filter(
            (value) => value.position === segment.position && value.project === segment.project
          ).length) {
            this.hiddenRows.push({ position: segment.position, project: segment.project })
          }
          lastPositions.push({ position: segment.position, project: segment.project })
        }
      }
    }

  }

  hasUnderLevel(row: SegmentsRPCNC) {
    const segments = this.isTotal ? this.segmentsTotal : this.segments

    return segments.filter(
      (segment) => { return segment.underPosition === row.position && segment.project === row.project}
    ).length > 0
  }

  toggleIsActual() {
    this.isActual = !this.isActual
    this.ccFilters.isActualChanged(this.isActual)
  }

  switchReestrMode() {
    this.isInvestProjectOnly = !this.isInvestProjectOnly

    this.ccFilters.switchReestrMode()
  }

  isRowHidden(position: string, project: string) {
    return this.hiddenRows.filter(
      (value) => value.position === position && value.project === project
    ).length > 0
  }

  isPositionHidden(project: string, position: string) {
    return this.hiddenPositions.filter(
      (value) => value.position === position && value.project === project
    ).length > 0
  }

  getInfoFile(row: SegmentsRPCNC, regionType: string) {
    this.updating = true
    this.datepickerService.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'y')
    this.datepickerService.toDate = this.calendar.getToday()

    this.dataService.contractsPivot.next({ actions: [], tries: [] })
    this.dataService.phonesPivot.next({ actions: [], tries: [] })

    this.dataService.regionType = regionType
    this.dataService.position = row.position
    this.dataService.project = row.project
    this.dataService.projects = row.project === 'Всього' ?
      [...new Set(this.segments.map(value => value.project))] : [row.project]

    this.dataService.positionRoute = []
    const segments = this.isTotal ? this.segmentsTotal : this.segments
    while (true) {
      this.dataService.positionRoute.push(row.position)

      const rows = segments.filter(segment => segment.position === row.underPosition && segment.position !== row.project && segment.project === row.project)
      if (rows.length > 0)
        row = rows[0]
      else break
    }

    this.router.navigate(['callcenter', 'PhoneSegmentation'])
  }
}
