import { inject, Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { SegmentationPivotModel } from '../models/filters.model'
import {
  DebtDpdBucketSingleData,
  SegmentationBucketTableModel,
  SegmentationDebtDpdTableModel,
  SegmentationModel,
  SegmentationNewPivotModel,
  SegmentationTotalTableModel
} from '../models/report-models'
import { CcFiltersService } from './cc-filters.service'

@Injectable({
  providedIn: 'root'
})
export class CcSegmentationService {
  private ccFilters = inject(CcFiltersService)

  currentReports: SegmentationPivotModel[] = []

  fullData: SegmentationModel[] = []
  totalReport = new Subject<SegmentationTotalTableModel[]>()
  dpdReport = new Subject<SegmentationBucketTableModel[]>()
  debtReport = new Subject<SegmentationBucketTableModel[]>()
  dpdDebtReport = new Subject<SegmentationDebtDpdTableModel[]>()

  getProjects() {
    return [...new Set(this.fullData.map((value) => value.ProjectName))]
  }

  countDeviation(ContractCountProjectPercent: number, PhonePresence?: string) {
    if (PhonePresence !== 'Без телефонів')
      return undefined
    else {
      let percent = this.ccFilters.getTotalNoPhonePercent()
      return percent ? ContractCountProjectPercent - percent : undefined
    }
  }

  filterFromPhoneType(row: SegmentationModel, phoneType: string) {
    if (phoneType === 'Без телефонів')
      return row.ActualPhonesCount === 0
    else if (phoneType === 'Лише стаціонарний')
      return row.ActualPhonesCount > 0 && row.ActualPhonesCountMobile === 0
    else if (phoneType === 'Є мобільний')
      return row.ActualPhonesCount > 0 && row.ActualPhonesCountMobile > 0
    else
      return row.ActualPhonesCount > 0
  }

  getTotalRow(project: string, allPhoneTypes: string[], phoneType?: string): SegmentationNewPivotModel {
    let data: SegmentationModel[]
    let fullData: SegmentationModel[]

    if (allPhoneTypes.length > 0)
      fullData = this.fullData.filter((row) => {
        return allPhoneTypes.some((phone) => this.filterFromPhoneType(row, phone))
      })
    else
      fullData = this.fullData.slice()

    if (typeof phoneType === 'undefined') //  || phoneTypesLength != 1
      fullData = fullData.slice()
    else
      fullData = fullData.filter((value) => this.filterFromPhoneType(value, phoneType))

    let projectLength = this.fullData.filter((value) => value.ProjectName === project).length

    if (project === 'Всього') {
      data = fullData
      projectLength = this.fullData.length
    } else if (typeof phoneType === 'undefined')
      data = fullData.filter((value) => value.ProjectName === project)
    else
      data = fullData.filter((value) => value.ProjectName === project && this.filterFromPhoneType(value, phoneType))

    let SumDelayBody: number = data.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )
    let sumDelayBodyTotal: number = fullData.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )
    let Outstanding: number = data.reduce(
      (acc, obj) => { return acc + obj.Outstanding }, 0
    )
    let BalancePercent: number = data.reduce(
      (acc, obj) => { return acc + obj.BalancePercent }, 0
    )

    return {
      ContractCount: data.length,
      ContractCountProjectPercent: projectLength ? data.length / projectLength * 100 : 0,
      SumDelayBody: SumDelayBody,
      Outstanding: Outstanding,
      BalancePercent: BalancePercent,
      SumDelayBodyPercent: sumDelayBodyTotal ? SumDelayBody / sumDelayBodyTotal * 100 : 0,
      DebtPartPercent: Outstanding ? BalancePercent / Outstanding * 100 : 0,
      BodyAvg: data.length ? SumDelayBody / data.length : 0,
      OutstandingAvg: data.length ? Outstanding / data.length : 0,
      DpdAvg: data.length ? data.reduce(
        (acc, obj) => { return acc + obj.DPD }, 0
      ) / data.length : 0,
      Deviation: this.countDeviation(projectLength ? data.length / projectLength * 100 : 0, phoneType)
    }
  }

  getReportDpdRow(phoneData: SegmentationModel[], projectData: SegmentationModel[], projectLength: number) {
    let SumDelayBody: number = phoneData.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )
    let sumDelayBodyTotal: number = projectData.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )
    let Outstanding: number = phoneData.reduce(
      (acc, obj) => { return acc + obj.Outstanding }, 0
    )
    let BalancePercent: number = phoneData.reduce(
      (acc, obj) => { return acc + obj.BalancePercent }, 0
    )

    return {
      ContractCount: phoneData.length,
      ContractCountProjectPercent: projectLength ? phoneData.length / projectLength * 100 : 0,
      SumDelayBody: SumDelayBody,
      Outstanding: Outstanding,
      BalancePercent: BalancePercent,
      SumDelayBodyPercent: sumDelayBodyTotal ? SumDelayBody / sumDelayBodyTotal * 100 : 0,
      DebtPartPercent: Outstanding ? BalancePercent / Outstanding * 100 : 0,
      BodyAvg: phoneData.length ? SumDelayBody / phoneData.length : 0,
      OutstandingAvg: phoneData.length ? Outstanding / phoneData.length : 0,
      DpdAvg: phoneData.length ? phoneData.reduce(
        (acc, obj) => { return acc + obj.DPD }, 0
      ) / phoneData.length : 0,
      Deviation: 0
    }
  }

  getDebtDpdRow(bucketData: SegmentationModel[], fullData: SegmentationModel[]): DebtDpdBucketSingleData {
    let SumDelayBody: number = bucketData.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )
    let sumDelayBodyTotal: number = fullData.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )
    let Outstanding: number = bucketData.reduce(
      (acc, obj) => { return acc + obj.Outstanding }, 0
    )
    let OutstandingTotal: number = fullData.reduce(
      (acc, obj) => { return acc + obj.SumDelayBody }, 0
    )

    return {
      ContractCount: bucketData.length,
      ContractCountPercent: fullData.length ? bucketData.length / fullData.length * 100 : 0,
      BodyAvg: bucketData.length ? SumDelayBody / bucketData.length : 0,
      SumDelayBody: SumDelayBody,
      SumDelayBodyPercent: sumDelayBodyTotal ? SumDelayBody / sumDelayBodyTotal * 100 : 0,

      Outstanding: Outstanding,
      OutstandingPercent: OutstandingTotal ? Outstanding / OutstandingTotal * 100 : 0,
      OutstandingAvg: bucketData.length ? Outstanding / bucketData.length : 0
    }
  }
}













