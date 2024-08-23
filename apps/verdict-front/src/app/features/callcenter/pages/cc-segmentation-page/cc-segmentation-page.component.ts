import { Component, inject } from '@angular/core'
import { CcFiltersService } from '../../services/cc-filters.service'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { CcSegmentationService } from '../../services/cc-segmentation.service'
import { InputSegmentation } from '../../models/filters.model'
import {
  BucketData,
  DebtDpdBucketSingleData,
  DebtDpdPhoneData,
  PhoneBucketData,
  PhoneData,
  RowsDebtDpdData,
  SegmentationBucketTableModel,
  SegmentationDebtDpdTableModel,
  SegmentationModel,
  SegmentationTotalTableModel
} from '../../models/report-models'
import {
  CcSegmentationDebtDpdTableComponent
} from '../../components/report-tables/cc-segmentation-debt-dpd-table/cc-segmentation-debt-dpd-table.component'
import {
  CcSegmentationDebtTableComponent
} from '../../components/report-tables/cc-segmentation-debt-table/cc-segmentation-debt-table.component'
import {
  CcSegmentationDpdTableComponent
} from '../../components/report-tables/cc-segmentation-dpd-table/cc-segmentation-dpd-table.component'
import {
  CcSegmentationTotalTableComponent
} from '../../components/report-tables/cc-segmentation-total-table/cc-segmentation-total-table.component'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import {
  CcSegmentsRpcNcTotalInfoBoxComponent
} from '../../components/report-tables/cc-segments-rpc-nc-total-info-box/cc-segments-rpc-nc-total-info-box.component'
import { NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'
import { DebtsFilterComponent } from '../../components/filters/debts-filter/debts-filter.component'
import { DpdBucketFilterComponent } from '../../components/filters/dpd-bucket-filter/dpd-bucket-filter.component'
import { ReestrComponent } from '../../components/filters/reestr/reestr.component'
import { ReestrStatusComponent } from '../../components/filters/reestr-status/reestr-status.component'
import { ReestrTypeComponent } from '../../components/filters/reestr-type/reestr-type.component'
import { InvestProjectComponent } from '../../components/filters/invest-project/invest-project.component'
import { ProjectComponent } from '../../components/filters/project/project.component'
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component'

@Component({
  selector: 'cc-segmentation-page',
  templateUrl: './cc-segmentation-page.component.html',
  standalone: true,
  imports: [
    ProjectManagerComponent,
    ProjectComponent,
    InvestProjectComponent,
    ReestrTypeComponent,
    ReestrStatusComponent,
    ReestrComponent,
    DpdBucketFilterComponent,
    DebtsFilterComponent,
    NgFor,
    NgbTooltip,
    NgIf,
    CcSegmentsRpcNcTotalInfoBoxComponent,
    LoadingSpinnerComponent,
    NgbProgressbar,
    CcSegmentationTotalTableComponent,
    CcSegmentationDpdTableComponent,
    CcSegmentationDebtTableComponent,
    CcSegmentationDebtDpdTableComponent
  ]
})
export class CcSegmentationPageComponent {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)
  private segmentationDataService = inject(CcSegmentationService)

  phoneTypes: { type: string, description: string }[] = [
    { type: 'Без телефонів', description: 'Немає жодного актуального телефону, прив\'язаного до НКС' },
    { type: 'З телефонами', description: 'У клієнта є хоча б один актуальний телефон' }
  ]
  phoneTypesSplit: boolean = false
  segmentationTypes: { type: string, description: string }[] = [
    { type: 'Сегментація за DPD', description: '' },
    { type: 'Сегментація за сумою боргу', description: '' }
  ]
  selectedPhoneTypes: string[] = []
  selectedSegmentationTypes: string[] = []
  selectedTotalReport: boolean = false

  loading: boolean = false
  updating: boolean = false

  reportType: 'TotalReport' | 'DebtReport' | 'DpdReport' | 'DebtDpdReport' | null = null

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

    const input_data: InputSegmentation = {
      RNumber: this.ccFilters.selectedRnumbers,
      isInvestProjects: this.isInvestProjectOnly
    }
    this.httpService.getCCSegmentationReport(input_data)
      .subscribe({
        next: data => { this.segmentationDataService.fullData = data },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.loading = false
        },
        complete: () => {
          if (this.selectedSegmentationTypes.length === 0 && !this.selectedTotalReport)
            this.messageService.sendInfo('Звіт завантажено. Оберіть сегментацію.')
          else
            this.updateReport()

          this.loading = false
        }
      })
  }

  updateReport() {
    if (this.segmentationDataService.fullData.length === 0) return

    if (this.selectedTotalReport) {
      this.reportType = 'TotalReport'
      this.updating = true
      setTimeout(() => this.getTotalReport())
    } else if (
      this.selectedSegmentationTypes.includes('Сегментація за DPD') &&
      this.selectedSegmentationTypes.includes('Сегментація за сумою боргу')
    ) {
      this.reportType = 'DebtDpdReport'
      this.updating = true
      setTimeout(() => this.getDebtDpdReport())
    } else if (this.selectedSegmentationTypes.includes('Сегментація за DPD')) {
      this.reportType = 'DpdReport'
      this.updating = true
      setTimeout(() => this.getBucketReport('DPD'))
    } else if (this.selectedSegmentationTypes.includes('Сегментація за сумою боргу')) {
      this.reportType = 'DebtReport'
      this.updating = true
      setTimeout(() => this.getBucketReport('Debt'))
    }
  }

  getTotalReport(totalOnly: boolean = false) {
    let report: SegmentationTotalTableModel[] = []

    let projects: string[] = this.segmentationDataService.getProjects()
    for (let project of projects) {
      let phoneData: PhoneData[] = []
      if (!totalOnly)
        for (let phoneType of this.selectedPhoneTypes)
          phoneData.push({
            PhonePresence: phoneType,
            data: this.segmentationDataService.getTotalRow(project, this.selectedPhoneTypes, phoneType)
          })
      if (phoneData.length > 1 || phoneData.length === 0)
        phoneData.push({
          PhonePresence: 'Всього',
          data: this.segmentationDataService.getTotalRow(project, this.selectedPhoneTypes)
        })

      report.push({
        project: project,
        phoneData: phoneData
      })
    }
    if (report.length > 0)
      report.push({
        project: 'Всього',
        phoneData: [{
          PhonePresence: (this.selectedPhoneTypes.length === 1) ? this.selectedPhoneTypes[0] : '',
          data: this.selectedPhoneTypes.length != 1 ?
            this.segmentationDataService.getTotalRow('Всього', this.selectedPhoneTypes) :
            this.segmentationDataService.getTotalRow('Всього', this.selectedPhoneTypes, this.selectedPhoneTypes[0])
        }]
      })

    this.updating = false
    this.segmentationDataService.totalReport.next(report)
  }

  getBucketReport(bucketType: 'DPD' | 'Debt') {
    let buckets = bucketType === 'DPD' ? this.ccFilters.selectedDPDBuckets : this.ccFilters.selectedDebtsBuckets

    let report: SegmentationBucketTableModel[] = []

    // оставляем только то, что входит в выбранные варианты наличия телефонов, если они выбраны вообще
    let fullFilteredData: SegmentationModel[]
    if (this.selectedPhoneTypes.length < this.phoneTypes.length && this.selectedPhoneTypes.length > 0)
      fullFilteredData = this.segmentationDataService.fullData.filter((row) => {
        return this.selectedPhoneTypes.some((phone) => this.segmentationDataService.filterFromPhoneType(row, phone))
      })
    else
      fullFilteredData = this.segmentationDataService.fullData

    // оставляем только то, что входит в выбранные бакеты, если они выбраны вообще
    if (buckets.length > 0) {
      fullFilteredData = fullFilteredData.filter((row) => {
        if (bucketType === 'DPD')
          return buckets.some(bucket => this.filterFromBucket(row.DPD, bucket))
        else
          return buckets.some(bucket => this.filterFromBucket(row.Debt, bucket))
      })
    }

    let projects: string[] = this.segmentationDataService.getProjects()
    for (let project of projects) {
      let projectFilteredData: SegmentationModel[] = fullFilteredData.filter(
        (value) => value.ProjectName === project
      )
      let projectDataLength: number = this.segmentationDataService.fullData.filter(
        (value) => value.ProjectName === project
      ).length

      let phoneData: PhoneBucketData[] = []
      for (let phoneType of this.selectedPhoneTypes) {
        let phoneFilteredData: SegmentationModel[] = projectFilteredData.filter(
          (value) => this.segmentationDataService.filterFromPhoneType(value, phoneType)
        )

        let bucketData: BucketData[] = []
        for (let bucket of buckets) {
          let buckets = this.splitBucket(bucket)
          let lowBucket = buckets.lowBucket
          let topBucket = buckets.topBucket

          let bucketFilteredData: SegmentationModel[] = phoneFilteredData.filter((value) => {
            switch (bucketType) {
              case 'DPD':
                return topBucket ?
                  value.DPD >= lowBucket && value.DPD < topBucket :
                  (lowBucket ? value.DPD >= lowBucket : true)
              case 'Debt':
                return topBucket ?
                  value.Debt >= lowBucket && value.Debt < topBucket :
                  (lowBucket ? value.Debt >= lowBucket : true)
            }
          })

          bucketData.push({
            bucket: bucket,
            data: this.segmentationDataService.getReportDpdRow(
              bucketFilteredData,
              fullFilteredData,
              projectDataLength
            ),
            hidden: false
          })
        }
        bucketData.push({
          bucket: 'Всього',
          data: this.segmentationDataService.getReportDpdRow(
            phoneFilteredData,
            fullFilteredData,
            projectDataLength
          ),
          hidden: false
        })

        phoneData.push({
          PhonePresence: phoneType,
          bucketData: bucketData,
          hidden: false
        })
      }
      phoneData.push({
        PhonePresence: 'Всього',
        bucketData: [{
          bucket: '',
          data: this.segmentationDataService.getReportDpdRow(
            projectFilteredData,
            fullFilteredData,
            projectDataLength
          ),
          hidden: false
        }],
        hidden: false
      })

      report.push({
        project: project,
        phoneData: phoneData
      })

    }

    report.push({
      project: 'Всього',
      phoneData: [{
        PhonePresence: '',
        bucketData: [{
          bucket: '',
          data: this.segmentationDataService.getReportDpdRow(
            fullFilteredData,
            fullFilteredData,
            this.segmentationDataService.fullData.length
          ),
          hidden: false
        }],
        hidden: false
      }]
    })

    this.updating = false
    switch (bucketType) {
      case 'DPD':
        this.segmentationDataService.dpdReport.next(report)
        return
      case 'Debt':
        this.segmentationDataService.debtReport.next(report)
        return
    }
  }

  getDebtDpdReport() {
    let report: SegmentationDebtDpdTableModel[] = []

    let projects: string[] = this.segmentationDataService.getProjects()

    // оставляем только то, что входит в выбранные варианты наличия телефонов, если они выбраны вообще
    let fullFilteredData: SegmentationModel[]
    if (this.selectedPhoneTypes.length < this.phoneTypes.length && this.selectedPhoneTypes.length > 0)
      fullFilteredData = this.segmentationDataService.fullData.filter((row) => {
        return this.selectedPhoneTypes.some((phone) => this.segmentationDataService.filterFromPhoneType(row, phone))
      })
    else
      fullFilteredData = this.segmentationDataService.fullData

    // оставляем только то, что входит в выбранные бакеты, если они выбраны вообще
    if (this.ccFilters.selectedDebtsBuckets.length > 0 && this.ccFilters.selectedDPDBuckets.length > 0) {
      fullFilteredData = fullFilteredData.filter((row) => {
        return this.ccFilters.selectedDPDBuckets.some(bucket => this.filterFromBucket(row.DPD, bucket)) &&
          this.ccFilters.selectedDebtsBuckets.some(bucket => this.filterFromBucket(row.Debt, bucket))
      })
    }

    for (let project of projects) {
      let projectFilteredData = fullFilteredData.filter((value) => value.ProjectName === project)

      let phoneData: DebtDpdPhoneData[] = []
      for (let phoneType of this.selectedPhoneTypes) {
        let phoneFilteredData = projectFilteredData.filter(
          (value) => this.segmentationDataService.filterFromPhoneType(value, phoneType)
        )

        let rowsDebtDpdData: RowsDebtDpdData = {
          ContractCount: [],
          ContractCountPercent: [],
          SumDelayBody: [],
          SumDelayBodyPercent: [],
          BodyAvg: [],
          Outstanding: [],
          OutstandingPercent: [],
          OutstandingAvg: []
        }
        for (let debtBucket of this.ccFilters.selectedDebtsBuckets) {
          let debtBuckets = this.splitBucket(debtBucket)

          let debtBucketFilteredData: SegmentationModel[] = phoneFilteredData.filter((value) => {
            return debtBuckets.topBucket ?
              value.Debt >= debtBuckets.lowBucket && value.Debt < debtBuckets.topBucket :
              (debtBuckets.lowBucket ? value.Debt >= debtBuckets.lowBucket : true)
          })

          let dpdBucketData: DebtDpdBucketSingleData[] = this.fillDpdBucketData(debtBucketFilteredData, fullFilteredData)
          this.appendDpdBucketData(rowsDebtDpdData, debtBucket, dpdBucketData)
        }

        phoneData.push({
          PhonePresence: phoneType,
          data: rowsDebtDpdData,
          hidden: false
        })

      }
      let rowsDebtDpdData: RowsDebtDpdData = {
        ContractCount: [],
        ContractCountPercent: [],
        SumDelayBody: [],
        SumDelayBodyPercent: [],
        BodyAvg: [],
        Outstanding: [],
        OutstandingPercent: [],
        OutstandingAvg: []
      }
      let dpdBucketData: DebtDpdBucketSingleData[] = this.fillDpdBucketData(projectFilteredData, fullFilteredData)
      this.appendDpdBucketData(rowsDebtDpdData, '', dpdBucketData)
      phoneData.push({
        PhonePresence: 'Всього',
        data: rowsDebtDpdData,
        hidden: false
      })

      report.push({
        phoneData: phoneData,
        project: project
      })
    }

    let rowsDebtDpdDataTotal: RowsDebtDpdData = {
      ContractCount: [],
      ContractCountPercent: [],
      SumDelayBody: [],
      SumDelayBodyPercent: [],
      BodyAvg: [],
      Outstanding: [],
      OutstandingPercent: [],
      OutstandingAvg: []
    }
    let dpdBucketDataTotal: DebtDpdBucketSingleData[] = this.fillDpdBucketData(fullFilteredData, fullFilteredData)
    this.appendDpdBucketData(rowsDebtDpdDataTotal, '', dpdBucketDataTotal)

    report.push({
      phoneData: [{
        PhonePresence: '',
        data: rowsDebtDpdDataTotal,
        hidden: false
      }],
      project: 'Всього'
    })

    this.updating = false
    this.segmentationDataService.dpdDebtReport.next(report)
  }

  fillDpdBucketData(debtBucketFilteredData: SegmentationModel[], fullFilteredData: SegmentationModel[]): DebtDpdBucketSingleData[] {
    let dpdBucketData: DebtDpdBucketSingleData[] = []
    for (let dpdBucket of this.ccFilters.selectedDPDBuckets) {
      let dpdBuckets = this.splitBucket(dpdBucket)

      let dpdBucketFilteredData: SegmentationModel[] = debtBucketFilteredData.filter((value) => {
        return dpdBuckets.topBucket ?
          value.DPD >= dpdBuckets.lowBucket && value.DPD < dpdBuckets.topBucket :
          (dpdBuckets.lowBucket ? value.DPD >= dpdBuckets.lowBucket : true)
      })
      dpdBucketData.push(this.segmentationDataService.getDebtDpdRow(dpdBucketFilteredData, fullFilteredData))
    }

    dpdBucketData.push(this.segmentationDataService.getDebtDpdRow(debtBucketFilteredData, fullFilteredData))
    return dpdBucketData
  }

  appendDpdBucketData(rowsDebtDpdData: RowsDebtDpdData, debtBucket: string, dpdBucketData: DebtDpdBucketSingleData[]) {
    rowsDebtDpdData.ContractCount.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.ContractCount)
    })
    rowsDebtDpdData.ContractCountPercent.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.ContractCountPercent)
    })
    rowsDebtDpdData.SumDelayBody.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.SumDelayBody)
    })
    rowsDebtDpdData.SumDelayBodyPercent.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.SumDelayBodyPercent)
    })
    rowsDebtDpdData.BodyAvg.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.BodyAvg)
    })

    rowsDebtDpdData.Outstanding.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.Outstanding)
    })
    rowsDebtDpdData.OutstandingPercent.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.OutstandingPercent)
    })
    rowsDebtDpdData.OutstandingAvg.push({
      debtBucket: debtBucket, hidden: false,
      dpdValues: dpdBucketData.map((value) => value.OutstandingAvg)
    })
  }

  splitBucket(bucket: string): { lowBucket: number, topBucket?: number } {
    let buckets = bucket.match(/\d+/g)
    let lowBucket: number | undefined
    let topBucket: number | undefined
    if (buckets == null)
      throw Error('Проблема с парсингом бакета')
    if (buckets.length === 2) {
      lowBucket = +buckets[0]
      topBucket = +buckets[1]
    } else
      lowBucket = +buckets[0]

    return { lowBucket: lowBucket, topBucket: topBucket }
  }

  // Other stuff

  allFiltersSelected() {
    return (
      this.ccFilters.selectedRnumbers.length > 0
    )
  }

  toggleIsActual() {
    this.isActual = !this.isActual
    this.ccFilters.isActualChanged(this.isActual)
  }

  switchReestrMode() {
    this.isInvestProjectOnly = !this.isInvestProjectOnly

    this.ccFilters.switchReestrMode()
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  toggleSegmentType(type: string) {
    if (this.selectedSegmentationTypes.includes(type)) {
      this.selectedSegmentationTypes = this.selectedSegmentationTypes.filter(
        selType => { return selType !== type }
      )
    } else {
      this.selectedSegmentationTypes.push(type)
    }
  }

  togglePhoneType(type: string) {
    if (this.selectedPhoneTypes.includes(type)) {
      this.selectedPhoneTypes = this.selectedPhoneTypes.filter(
        selType => { return selType !== type }
      )
    } else {
      this.selectedPhoneTypes.push(type)
    }
  }

  splitPhoneType() {
    if (!this.phoneTypesSplit) {
      this.phoneTypes = this.phoneTypes.filter((value) => value.type !== 'З телефонами')

      this.phoneTypes.push({
        type: 'Є мобільний',
        description: 'У клієнта актуальним є актуальні мобільні номера'
      })
      this.phoneTypes.push({
        type: 'Лише стаціонарний',
        description: 'У клієнта актуальним є лише стаціонарні телефони і відсутні актуальні мобільні номера'
      })

      if (this.selectedPhoneTypes.includes('З телефонами')) {
        this.selectedPhoneTypes = this.selectedPhoneTypes.filter(
          selType => {
            return selType !== 'З телефонами'
          }
        )
        this.selectedPhoneTypes.push('Є мобільний')
        this.selectedPhoneTypes.push('Лише стаціонарний')
      }
    } else {
      this.phoneTypes = this.phoneTypes.filter(
        (value) => !['Є мобільний', 'Лише стаціонарний'].includes(value.type)
      )
      this.phoneTypes.push({ type: 'З телефонами', description: 'У клієнта є хоча б один актуальний телефон' })
    }

    this.phoneTypesSplit = !this.phoneTypesSplit
    this.selectedPhoneTypes = this.selectedPhoneTypes.filter(
      (value) => this.phoneTypes.map((val) => val.type).includes(value)
    )
    this.updateReport()
  }

  private filterFromBucket(bucketValue: number, bucket: string) {
    let buckets = this.splitBucket(bucket)
    let lowBucket = buckets.lowBucket
    let topBucket = buckets.topBucket

    return topBucket ?
      bucketValue >= lowBucket && bucketValue < topBucket :
      (lowBucket ? bucketValue >= lowBucket : true)
  }
}
