import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CcFiltersService } from '../../services/cc-filters.service'
import { CcSegmentsRpcNcDataService } from '../../services/cc-segments-rpc-nc-data.service'
import { PhoneContractSegmentationReport, PhoneSegmentationReport } from '../../models/report-models'
import { Subscription } from 'rxjs'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { Router, RouterLink } from '@angular/router'
import { DatepickerService } from '../../../../shared/components/datepicker/datepicker.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker.component'


@Component({
  selector: 'cc-phone-segmentation-page',
  templateUrl: './cc-phone-segmentation-page.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DatepickerComponent,
    NgIf,
    NgFor,
    LoadingSpinnerComponent,
    NgbProgressbar,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class CcPhoneSegmentationPageComponent implements OnInit, OnDestroy {
  private ccFilters = inject(CcFiltersService)
  public rpcNcDataService = inject(CcSegmentsRpcNcDataService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)
  private datepickerService = inject(DatepickerService)
  private router = inject(Router)

  loading: boolean = false
  updating: boolean = false

  contractsPivot: PhoneContractSegmentationReport = { actions: [], tries: [] }
  phonesPivot: PhoneSegmentationReport = { actions: [], tries: [] }

  data$?: Subscription
  contractsPivot$?: Subscription
  phonesPivot$?: Subscription
  header: string[] = []

  get wholeTime() {
    return this.rpcNcDataService.wholeTime
  }

  get segments() {
    return this.rpcNcDataService.pivotSegments
  }

  get position() {
    return this.rpcNcDataService.position
  }

  get positionRoute() {
    return this.rpcNcDataService.positionRoute.slice().reverse().join(' > ')
  }

  get regionType() {
    return this.rpcNcDataService.regionType
  }

  get projects() {
    return this.rpcNcDataService.projects.join('; ')
  }

  get startDate() {
    return this.datepickerService.getFromDate()
  }

  get endDate() {
    return this.datepickerService.getToDate()
  }

  get actionPerContract() {
    let text: string = ''
    for (let range of this.segments.filter(value => value.selectedContract && value.name !== 'Всього')) {
      let addedText = `${range.value[0]}-${range.value[1]}`
      if (range.value[0] === range.value[1])
        addedText = `${range.value[0]}`

      text += (text ? '; ' : '') + addedText
    }

    return text
  }

  get actionPerPhone() {
    let text: string = ''
    for (let range of this.segments.filter(value => value.selectedPhone && value.name !== 'Всього')) {
      let addedText = `${range.value[0]}-${range.value[1]}`
      if (range.value[0] === range.value[1])
        addedText = `${range.value[0]}`

      text += (text ? '; ' : '') + addedText
    }

    return text
  }

  ngOnInit(): void {
    this.updating = true
    this.rpcNcDataService.phoneStatuses.forEach(value => value.selected = false)
    this.rpcNcDataService.pivotSegments.forEach((value, index) => {
      value.selectedContract = index <= 1
      value.selectedPhone = true
    })

    this.contractsPivot$ = this.rpcNcDataService.contractsPivot
      .subscribe({
        next: data => {
          this.contractsPivot = data
          this.updating = false
        },
        error: () => this.updating = false
      })
    this.phonesPivot$ = this.rpcNcDataService.phonesPivot
      .subscribe({
        next: data => {
          this.phonesPivot = data
          this.updating = false
        },
        error: () => this.updating = false
      })
  }

  ngOnDestroy() {
    this.data$?.unsubscribe()
    this.contractsPivot$?.unsubscribe()
    this.phonesPivot$?.unsubscribe()
  }

  getData() {
    this.updating = true
    setTimeout(() => this.rpcNcDataService.getSegmentationData())
  }

  getInfoFile(contracts: number[]) {
    this.updating = true
    this.httpService.getRpcNcInfoFromContracts({
      contracts: contracts,
      isInvestProjects: this.ccFilters.isInvestProjectOnly,
      regionType: this.rpcNcDataService.regionType
    }).subscribe({
      next: value => this.rpcNcDataService.rpcNcInfo.next(value),
      error: err => {
        this.messageService.sendError('Не вдалося отримати дані від серверу' + err)
        this.updating = false
      },
      complete: () => {
        this.updating = false
        this.router.navigate(['callcenter', 'SegmentsRPCNC', 'info'])
      }
    })
  }

  filtersSelected() {
    return this.rpcNcDataService.project !== ''
  }

  updatePivot() {
    this.updating = true
    setTimeout(() => this.rpcNcDataService.serverPivotPhonesData())
  }

  // DOWNLOAD RAW FILE INFO WITH PHONES

  downloadPhonesFromContracts(contracts: number[]) {
    this.updating = true
    this.httpService.downloadPhonesFromContracts(contracts)
      .subscribe({
        next: (file) => {
          UtilFunctions.downloadXlsx(file, 'Телефони з RPC NC')
        },
        error: async error => {
          this.messageService.sendError(
            'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
          )
          this.updating = false
        },
        complete: () => {
          this.updating = false
        }
      })
  }

  downloadPhones(contracts: { contract: number, phone: string }[]) {
    this.updating = true
    this.httpService.downloadPhones(contracts)
      .subscribe({
        next: (file) => {
          UtilFunctions.downloadXlsx(file, 'Телефони з RPC NC')
        },
        error: async error => {
          this.messageService.sendError(
            'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
          )
          this.updating = false
        },
        complete: () => {
          this.updating = false
        }
      })
  }

  togglePhoneStatus(status: { name: string; selected: boolean; value: string }) {
    status.selected = !status.selected
  }

  toggleDates() {
    this.rpcNcDataService.wholeTime = !this.rpcNcDataService.wholeTime
  }
}



















