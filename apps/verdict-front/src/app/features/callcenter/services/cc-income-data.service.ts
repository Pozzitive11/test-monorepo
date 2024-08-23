import { Injectable } from '@angular/core'
import {
  IncomeDateRow,
  IncomeDateTable,
  IncomeModel,
  IncomeRnumberRow,
  IncomeRnumberTable
} from '../models/report-models'
import { BehaviorSubject } from 'rxjs'


interface DateData {
  DatePay: Date | string
  DatePayData: IncomeDateRow[]
  hidden: boolean
}


@Injectable({
  providedIn: 'root'
})
export class CcIncomeDataService {
  reportData: IncomeModel[] = []
  dateData = new BehaviorSubject<IncomeDateTable[]>([])
  rnumberData = new BehaviorSubject<IncomeRnumberTable[]>([])

  updateReport(isDateFirst: boolean) {
    if (isDateFirst) {
      this.reportData = this.reportData.sort(
        (a, b) => {
          return a.ProjectName < b.ProjectName ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.DatePay < b.DatePay ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.Rnumber < b.Rnumber ? -1 : 1
        }
      )
      this.pivotDateData()
    } else {
      this.reportData = this.reportData.sort(
        (a, b) => {
          return a.ProjectName < b.ProjectName ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.Rnumber < b.Rnumber ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.DatePay < b.DatePay ? -1 : 1
        }
      )
      this.pivotRnumberData()
    }
  }

  private pivotDateData() {
    let report: IncomeDateTable[] = []
    let projects: string[] = [...new Set(this.reportData.map((value) => value.ProjectName))]
    let dates: Date[] = [...new Set(this.reportData.map((value) => value.DatePay))]
    console.log(dates)

    for (let project of projects) {
      let ProjectData: DateData[] = []
      let projectFilteredData = this.reportData.filter((value) => value.ProjectName === project)

      for (let date of dates) {
        let DatePayData: IncomeDateRow[] = []
        let dateFilteredData = projectFilteredData.filter((value) => value.DatePay === date)

        for (let row of dateFilteredData) {
          DatePayData.push({
            ...row,
            Prc: row.Prc * 100,
            hidden: false
          })
        }

        DatePayData.push(this.getDatePayTotalRow(dateFilteredData, 'Всього за датою'))
        ProjectData.push({ DatePay: date, DatePayData: DatePayData, hidden: false })
      }
      ProjectData.push({
        DatePay: 'Всього за проєктом',
        DatePayData: [this.getDatePayTotalRow(projectFilteredData)],
        hidden: false
      })

      report.push({
        ProjectData: ProjectData, ProjectName: project
      })
    }

    report.push({
      ProjectData: [
        { DatePay: '', DatePayData: [this.getDatePayTotalRow(this.reportData)], hidden: false }
      ], ProjectName: 'Всього'
    })

    this.dateData.next(report)

  }

  private pivotRnumberData() {
    let report: IncomeRnumberTable[] = []
    let projects: string[] = [...new Set(this.reportData.map((value) => value.ProjectName))]

    for (let project of projects) {
      let ProjectData: {
        Rnumber: string | number
        RnumberData: IncomeRnumberRow[]
        hidden: false
      }[] = []
      let projectFilteredData = this.reportData.filter((value) => value.ProjectName === project)
      let rnumbers: (number | string)[] = [...new Set(projectFilteredData.map((value) => value.Rnumber))]

      for (let rnumber of rnumbers) {
        let RnumberData: IncomeRnumberRow[] = []
        let rnumberFilteredData = projectFilteredData.filter((value) => value.Rnumber === rnumber)

        for (let row of rnumberFilteredData) {
          RnumberData.push({
            ...row,
            Prc: row.Prc * 100,
            hidden: false
          })
        }

        RnumberData.push(this.getRnumberTotalRow(rnumberFilteredData, 'Всього за реєстром'))
        ProjectData.push({ Rnumber: rnumber, RnumberData: RnumberData, hidden: false })
      }
      ProjectData.push({
        Rnumber: 'Всього за проєктом',
        RnumberData: [this.getRnumberTotalRow(projectFilteredData)],
        hidden: false
      })

      report.push({
        ProjectData: ProjectData, ProjectName: project
      })
    }

    report.push({
      ProjectData: [
        { Rnumber: '', RnumberData: [this.getRnumberTotalRow(this.reportData)], hidden: false }
      ], ProjectName: 'Всього'
    })

    this.rnumberData.next(report)
  }

  private getTotalRow(data: IncomeModel[]) {
    const AllPay = data.reduce((acc, row) => acc + row.AllPay, 0)
    const Income = data.reduce((acc, row) => acc + row.Income, 0)

    const Prc = AllPay ? Income / AllPay * 100 : 0
    const MaxDatePayReestr = data.map((value) => value.MaxDatePayReestr).reduce((a, b) => a > b ? a : b)

    return {
      AllPay: AllPay,
      Income: Income,
      MaxDatePayReestr: MaxDatePayReestr,
      Prc: Prc,
      hidden: false
    }
  }

  private getDatePayTotalRow(data: IncomeModel[], Rnumber: string | number = ''): IncomeDateRow {
    return {
      Rnumber: Rnumber,
      ...this.getTotalRow(data)
    }
  }


  private getRnumberTotalRow(data: IncomeModel[], datePay: string = '') {
    return {
      DatePay: datePay,
      ...this.getTotalRow(data)
    }
  }
}















