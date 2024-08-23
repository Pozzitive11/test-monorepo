import { inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { TimeFact, TimePlan, TimePlanFact, TimePlanFactReport, TimePlanFactSwitchable } from '../models/report-models'
import { InputTimePlanFact } from '../models/filters.model'
import { CcFiltersService } from './cc-filters.service'
import { CcHttpClientService } from './cc-http-client.service'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { DatepickerService } from '../../../shared/components/datepicker/datepicker.service'

@Injectable({
  providedIn: 'root'
})
export class CcTimePlanFactDataService {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)
  private datepickerService = inject(DatepickerService)

  fullReportData?: TimePlanFactReport
  reportData = new BehaviorSubject<TimePlanFactSwitchable[]>([])

  selectedReportTypes: string[] = []

  getData() {
    const input_data: InputTimePlanFact = {
      StartDate: this.datepickerService.getFromDate(),
      EndDate: this.datepickerService.getToDate(),
      ExcludedLogins: this.ccFilters.selectedExcludedLogins
    }
    this.httpService.getCCTimePlanFactReport(input_data)
      .subscribe({
        next: reportData => {
          this.fullReportData = reportData
          this.updateData()
        },
        error: err => {
          this.reportData.next([])
          this.messageService.sendError(err.error.detail)
        }
      })
  }

  allFiltersSelected() {
    return !!this.datepickerService.toDate
  }

  updateData(excludedEPProjects: string[] = []) {
    if (!this.fullReportData)
      return
    let reportData = { ...this.fullReportData }

    const allProjects: string[] = [...new Set([
      ...reportData.Plan.map(value => value.ProjectName),
      ...reportData.Fact.map(value => value.ProjectName)
    ])]
    // let excludedEPProjects: string[] = []
    // if (!newData) {
    //   this.reportData.subscribe(
    //     currentReport => currentReport.forEach(
    //       value => { if (value.excludeEP) excludedEPProjects.push(value.ProjectName) }
    //     )
    //   ).unsubscribe()
    // }

    const countFactTime = function(project: string, acc: number, val: TimeFact) {
      // не плюсуем "З ВП" если в таблице стоит отметка
      if (excludedEPProjects.includes(project) && val.EPFlag === 'З ВП')
        return acc
      return acc + (val.WTimeFact ? val.WTimeFact : 0)
    }
    const countPlanTime = function(project: string, acc: number, val: TimePlan) {
      // не плюсуем "З ВП" если в таблице стоит отметка
      if (excludedEPProjects.includes(project) && val.PlanType === 'З ВП')
        return acc
      return acc + (val.WTimePlan ? val.WTimePlan : 0)
    }
    const countPlanNowTime = function(project: string, acc: number, val: TimePlan) {
      // не плюсуем "З ВП" если в таблице стоит отметка
      if (excludedEPProjects.includes(project) && val.PlanType === 'З ВП')
        return acc
      return acc + (val.WTimePlanNow ? val.WTimePlanNow : 0)
    }

    if (this.selectedReportTypes.length === 0 || this.selectedReportTypes.length === 2) {
      let report: TimePlanFact[] = []
      for (let project of allProjects) {
        const factTime: number = reportData.Fact
          .filter(value => value.ProjectName === project)
          .reduce((acc, val) => countFactTime(project, acc, val), 0)

        const planTime: number = reportData.Plan
          .filter(value => value.ProjectName === project)
          .reduce((acc, val) => countPlanTime(project, acc, val), 0)

        const planNowTime: number = reportData.Plan
          .filter(value => value.ProjectName === project)
          .reduce((acc, val) => countPlanNowTime(project, acc, val), 0)

        report.push({
          ProjectName: project,
          WTimeFact: factTime,
          WTimePlan: planTime,
          WTimePlanNow: planNowTime,
          Deviation: factTime - planNowTime,
          PRC: planTime ? factTime / planTime * 100 : 0
        })
      }

      this.reportData.next(
        report.map(
          (value) => { return { ...value, excludeEP: excludedEPProjects.includes(value.ProjectName) } }
        )
      )
    } else {
      let report: TimePlanFact[] = []

      if (this.selectedReportTypes[0] === 'З відкритими ВП') {
        reportData.Fact = reportData.Fact.filter(value => value.EPFlag === 'З ВП')
        reportData.Plan = reportData.Plan.filter(value => value.PlanType === 'З ВП')
      } else {
        reportData.Fact = reportData.Fact.filter(value => value.EPFlag === 'Без ВП')
        reportData.Plan = reportData.Plan.filter(value => value.PlanType === 'Без ВП')
      }

      for (let project of allProjects) {
        const factTime: number = reportData.Fact
          .filter(value => value.ProjectName === project)
          .reduce((acc, val) => acc + (val.WTimeFact ? val.WTimeFact : 0), 0)

        const planTime: number = reportData.Plan
          .filter(value => value.ProjectName === project)
          .reduce((acc, val) => acc + (val.WTimePlan ? val.WTimePlan : 0), 0)

        const planNowTime: number = reportData.Plan
          .filter(value => value.ProjectName === project)
          .reduce((acc, val) => acc + (val.WTimePlanNow ? val.WTimePlanNow : 0), 0)

        report.push({
          ProjectName: project,
          WTimeFact: factTime,
          WTimePlan: planTime,
          WTimePlanNow: planNowTime,
          Deviation: factTime - planNowTime,
          PRC: planTime ? factTime / planTime * 100 : 0
        })
      }

      this.reportData.next(
        report.map(
          (value) => { return { ...value, excludeEP: excludedEPProjects.includes(value.ProjectName) } }
        )
      )
    }

  }

}



