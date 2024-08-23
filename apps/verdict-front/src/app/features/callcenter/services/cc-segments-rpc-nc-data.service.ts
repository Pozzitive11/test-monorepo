import { inject, Injectable } from '@angular/core'
import {
  PhoneContractSegmentationReport,
  PhoneSegmentationReport,
  rangeTuple,
  RpcNcInfoModelWithHead,
  SegmentsRPCNC,
  SegmentsRPCNCRegion
} from '../models/report-models'
import { BehaviorSubject } from 'rxjs'
import { CcHttpClientService } from './cc-http-client.service'
import { CcFiltersService } from './cc-filters.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { DatepickerService } from '../../../shared/components/datepicker/datepicker.service'


@Injectable({
  providedIn: 'root'
})
export class CcSegmentsRpcNcDataService {
  private ccFilters = inject(CcFiltersService)
  private messageService = inject(MessageHandlingService)
  private httpService = inject(CcHttpClientService)
  private datepickerService = inject(DatepickerService)

  pivotSegments: rangeTuple[] = [
    { name: '0', value: [0, 0], selectedContract: true, selectedPhone: true },
    { name: 'від 1 до 5', value: [1, 5], selectedContract: true, selectedPhone: true },
    { name: 'від 6 до 10', value: [6, 10], selectedContract: false, selectedPhone: true },
    { name: 'від 11 до 15', value: [11, 15], selectedContract: false, selectedPhone: true },
    { name: 'від 16 до 20', value: [16, 20], selectedContract: false, selectedPhone: true },
    { name: 'більше 20', value: [21, null], selectedContract: false, selectedPhone: true },
    { name: 'Всього', value: [null, null], selectedContract: false, selectedPhone: false }
  ]
  phoneStatuses: { name: string, selected: boolean, value: string }[] = [
    { name: 'Актуальні телефони (мобільні)', selected: false, value: 'Актуальний (мобільний)' },
    { name: 'Актуальні телефони (стаціонарні)', selected: false, value: 'Актуальний (стаціонарний)' },
    { name: 'Неактуальний', selected: false, value: 'Неактуальний' },
    { name: 'Без телефону', selected: false, value: 'Без телефону' }
  ]
  maxLevel: number = 0
  header: string[] = []

  segments = new BehaviorSubject<SegmentsRPCNC[]>([])
  segmentsTotal = new BehaviorSubject<SegmentsRPCNC[]>([])
  rpcNcInfo = new BehaviorSubject<RpcNcInfoModelWithHead>({ header: [], data: [] })
  contractsPivot = new BehaviorSubject<PhoneContractSegmentationReport>({ actions: [], tries: [] })
  phonesPivot = new BehaviorSubject<PhoneSegmentationReport>({ actions: [], tries: [] })

  isTotal: boolean = false
  wholeTime: boolean = false
  regionType: string = ''
  position: string = ''
  project: string = ''
  projects: string[] = []
  positionRoute: string[] = []

  getData(isInvestProjectOnly: boolean) {
    this.httpService.getSegmentsRpcNcReport({
      RNumber: this.ccFilters.selectedRnumbers,
      isInvestProjects: isInvestProjectOnly
    }).subscribe({
      next: segments => {
        this.header = []
        this.segments.next(segments)
        if (segments.length > 0) {
          for (let item of segments[0].data) this.header.push(item.region_type)

          for (let segment of segments) {
            if (segment.level > this.maxLevel) this.maxLevel = segment.level
          }

          this.countTotal()
        }
      },
      error: err => {
        this.header = []
        this.messageService.sendError(err.error.detail)
        this.segments.next([])
      }
    })
  }

  private countTotal(): void {
    let segmentsTotal = []
    let segments: SegmentsRPCNC[] = []

    this.segments.subscribe(value => segments = value).unsubscribe()

    let allPositions = [...new Set(segments.map((row) => row.position))]
    for (let position of allPositions) {
      let positionSegments = segments.filter((value) => value.position === position)
      if (positionSegments[0].level === 0)
        continue

      let data: SegmentsRPCNCRegion[] = []
      for (let region of this.header) {
        let allData = positionSegments.map(
          (value) => value.data.filter((val) => val.region_type === region)
        )
        data.push({
          region_type: region,
          count: allData.reduce(
            (acc, val) => acc + val.reduce(
              (valAcc, valVal) => valAcc + valVal.count, 0
            ), 0
          )
        })
      }

      segmentsTotal.push({
        data: data,
        level: positionSegments[0].level - 1,
        position: positionSegments[0].level === 0 ? 'Всього' : position,
        project: 'Всього',
        underPosition: positionSegments[0].underPosition
      })
    }

    this.segmentsTotal.next(segmentsTotal)
  }

  getSegmentationData() {
    this.httpService.getCcPhoneSegmentation({
      position: this.position,
      isInvestProjects: this.ccFilters.isInvestProjectOnly,
      regionType: this.regionType,
      project: this.project,
      StartDate: this.wholeTime ? undefined : this.datepickerService.getFromDate(),
      EndDate: this.wholeTime ? undefined : this.datepickerService.getToDate()
    }).subscribe({
      next: () => this.serverPivotPhonesData(),
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.contractsPivot.next({ actions: [], tries: [] })
        this.phonesPivot.next({ actions: [], tries: [] })
      }
    })
  }

  serverPivotPhonesData() {
    const selectedPhoneStatuses: string[] = this.phoneStatuses.some(value => value.selected) ?
      this.phoneStatuses.filter(value => value.selected).map(value => value.value) :
      this.phoneStatuses.map(value => value.value)

    this.httpService.serverPivotPhonesData({
      selectedPhoneStatuses: selectedPhoneStatuses,
      pivotSegments: this.pivotSegments
    }).subscribe({
      next: value => {
        this.contractsPivot.next(value.contracts)
        this.phonesPivot.next(value.phones)
      },
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.contractsPivot.next({ actions: [], tries: [] })
        this.phonesPivot.next({ actions: [], tries: [] })
      }
    })
  }

}
