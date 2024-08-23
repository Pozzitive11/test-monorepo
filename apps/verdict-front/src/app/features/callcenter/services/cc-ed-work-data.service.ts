import { Injectable } from '@angular/core'
import {
  EverydayCCWorkDateRow,
  EverydayCCWorkDateTable,
  EverydayCCWorkModel,
  EverydayCCWorkRnumberRow,
  EverydayCCWorkRnumberTable
} from '../models/report-models'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CcEdWorkDataService {
  reportData: EverydayCCWorkModel[] = []
  rnumberData = new BehaviorSubject<EverydayCCWorkRnumberTable[]>([])
  dateData = new BehaviorSubject<EverydayCCWorkDateTable[]>([])

  updateReport(isDateFirst: boolean) {
    if (isDateFirst) {
      this.reportData = this.reportData.sort(
        (a, b) => {
          return a.ProjectName < b.ProjectName ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.ADate < b.ADate ? -1 : 1
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
          return a.ADate < b.ADate ? -1 : 1
        }
      )
      this.pivotRnumberData()
    }
  }

  private pivotDateData() {
    let report: EverydayCCWorkDateTable[] = []
    let projects: string[] = [...new Set(this.reportData.map((value) => value.ProjectName))]
    let dates: (Date | string)[] = [...new Set(this.reportData.map((value) => value.ADate))]

    for (let project of projects) {
      let ProjectData: {
        ADate: string | Date
        ADateData: EverydayCCWorkDateRow[]
        hidden: false
      }[] = []
      let projectFilteredData = this.reportData.filter((value) => value.ProjectName === project)

      for (let date of dates) {
        let ADateData: EverydayCCWorkDateRow[] = []
        let dateFilteredData = projectFilteredData.filter((value) => value.ADate === date)

        for (let row of dateFilteredData) {
          ADateData.push({
            ...row,
            IncomeFromPTP: row.PTPSum * (row.Prc ? row.Prc : 0),
            PTPtoRPCPercent: row.RPCcount > 0 ? row.PTPCount / row.RPCcount * 100 : 0,
            Prc: row.Prc ? row.Prc * 100 : 0,
            hidden: false
          })
        }

        ADateData.push(this.getADateTotalRow(dateFilteredData, 'Всього за датою'))
        ProjectData.push({ ADate: date, ADateData: ADateData, hidden: false })
      }
      ProjectData.push({
        ADate: 'Всього за проєктом',
        ADateData: [this.getADateTotalRow(projectFilteredData)],
        hidden: false
      })

      report.push({
        ProjectData: ProjectData, ProjectName: project
      })
    }

    report.push({
      ProjectData: [
        { ADate: '', ADateData: [this.getADateTotalRow(this.reportData)], hidden: false }
      ], ProjectName: 'Всього'
    })

    this.dateData.next(report)

  }

  private pivotRnumberData() {
    let report: EverydayCCWorkRnumberTable[] = []
    let projects: string[] = [...new Set(this.reportData.map((value) => value.ProjectName))]

    for (let project of projects) {
      let ProjectData: {
        Rnumber: string | number
        RnumberData: EverydayCCWorkRnumberRow[]
        hidden: false
      }[] = []
      let projectFilteredData = this.reportData.filter((value) => value.ProjectName === project)
      let rnumbers: (number | string)[] = [...new Set(projectFilteredData.map((value) => value.Rnumber))]

      for (let rnumber of rnumbers) {
        let RnumberData: EverydayCCWorkRnumberRow[] = []
        let rnumberFilteredData = projectFilteredData.filter((value) => value.Rnumber === rnumber)

        for (let row of rnumberFilteredData) {
          RnumberData.push({
            ...row,
            IncomeFromPTP: row.PTPSum * (row.Prc ? row.Prc : 0),
            PTPtoRPCPercent: row.RPCcount > 0 ? row.PTPCount / row.RPCcount * 100 : 0,
            Prc: row.Prc ? row.Prc * 100 : 0,
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

  private getTotalRow(data: EverydayCCWorkModel[]) {
    const PTPCount = data.reduce((acc, row) => acc + row.PTPCount, 0)
    const PTPSum = data.reduce((acc, row) => acc + row.PTPSum, 0)
    const IncomeFromPTP = data.reduce((acc, row) => acc + row.PTPSum * (row.Prc ? row.Prc : 0), 0)

    const Prc = data.reduce((acc, row) => acc + (row.Prc ? row.Prc : 0), 0) * 100
    const RPCcount = data.reduce((acc, row) => acc + row.RPCcount, 0)

    return {
      PTPCount: PTPCount,
      PTPSum: PTPSum,
      Prc: Prc,
      IncomeFromPTP: IncomeFromPTP,
      RPCcount: RPCcount,
      PTPtoRPCPercent: PTPCount / RPCcount * 100,
      PTPUnicCount: data.reduce((acc, row) => acc + row.PTPUnicCount, 0),
      PTPUnicSum: data.reduce((acc, row) => acc + row.PTPUnicSum, 0),
      RPCUnic196: data.reduce((acc, row) => acc + row.RPCUnic196, 0),
      RPCUnic202: data.reduce((acc, row) => acc + row.RPCUnic202, 0),
      RPCUnic210: data.reduce((acc, row) => acc + row.RPCUnic210, 0),
      RPCUnicCount: data.reduce((acc, row) => acc + row.RPCUnicCount, 0),
      hidden: false
    }
  }

  private getRnumberTotalRow(data: EverydayCCWorkModel[], aDate: string = ''): EverydayCCWorkRnumberRow {
    return {
      ADate: aDate,
      ...this.getTotalRow(data)
    }
  }

  private getADateTotalRow(data: EverydayCCWorkModel[], rnumber: string | number = ''): EverydayCCWorkDateRow {
    return {
      Rnumber: rnumber,
      ...this.getTotalRow(data)
    }
  }
}
