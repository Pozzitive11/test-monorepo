import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SortableTable } from '../../../abstract-classes/sortable-table.class'
import { IncomeRnumberRow, IncomeRnumberTable } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcIncomeDataService } from '../../../services/cc-income-data.service'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'


interface RnumberData {
  Rnumber: string | number
  RnumberData: IncomeRnumberRow[]
  hidden: boolean
}


@Component({
  selector: 'app-income-rnumber-table',
  templateUrl: './income-rnumber-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class IncomeRnumberTableComponent implements OnInit, OnDestroy, SortableTable {
  dataService = inject(CcIncomeDataService)

  header: string[] = [
    'Проєкт',
    'Номер реєстру',
    'Дата',

    'Комісія, %',
    'Сума збору , грн',
    'Сума доходу, грн',
    'Дата оновлення оплат'
  ]
  reportData: IncomeRnumberTable[] = []
  reportData$?: Subscription

  shownData: IncomeRnumberTable[] = []
  updating: boolean = false

  ngOnInit(): void {
    this.reportData$ = this.dataService.rnumberData
      .subscribe({
        next: report => {
          this.updating = true
          this.reportData = report
          setTimeout(() => this.updateShownData())
        }
      })
  }

  ngOnDestroy(): void {
    this.reportData$?.unsubscribe()
  }

  changeSortType(column: string): void {
  }

  countColumnLength(row: RnumberData | IncomeRnumberTable): number {
    return 'RnumberData' in row ?
      row.RnumberData.length :
      row.ProjectData.reduce((acc, val) => acc + val.RnumberData.length, 0)
  }

  hideAllColumn(column: string): void {
    if (!['Проєкт', 'Номер реєстру'].includes(column))
      return

    this.updating = true

    switch (column) {
      case 'Проєкт': {
        let state: boolean = this.reportData[0].ProjectData[0].hidden

        this.reportData.forEach((projectRow) => {
          if (projectRow.ProjectName.includes('Всього'))
            return

          projectRow.ProjectData.forEach((rnumberRow) => {
            if (!rnumberRow.Rnumber.toString().includes('Всього'))
              rnumberRow.hidden = !state
          })
        })
        break
      }

      case 'Номер реєстру': {
        let state: boolean = this.reportData[0].ProjectData[0].RnumberData[0].hidden

        this.reportData.forEach((projectRow) => {
          if (projectRow.ProjectName.includes('Всього'))
            return

          projectRow.ProjectData.forEach((rnumberRow) => {
            if (rnumberRow.Rnumber.toString().includes('Всього'))
              return

            rnumberRow.RnumberData.forEach((row) => {
              if (!row.DatePay.toString().includes('Всього'))
                row.hidden = !state
            })
          })
        })
        break
      }
    }

    setTimeout(() => this.updateShownData())
  }

  hideRow(projectNum?: number, rnumberNum?: number): void {
    this.updating = true
    let i: number = 0

    for (let projectRow of this.reportData) {
      let j: number = 0
      if (projectRow.ProjectName.includes('Всього'))
        continue

      for (let rnumberRow of projectRow.ProjectData) {
        if (rnumberRow.Rnumber.toString().includes('Всього'))
          continue
        if (projectNum === i && typeof rnumberNum === 'undefined')
          rnumberRow.hidden = !rnumberRow.hidden

        for (let row of rnumberRow.RnumberData) {
          if (projectNum === i && rnumberNum === j && !row.DatePay.toString().includes('Всього'))
            row.hidden = !row.hidden
        }
        j++
      }
      i++
    }

    setTimeout(() => this.updateShownData())
  }

  isRowHidden(projectNum?: number, rnumberNum?: number): boolean {
    if (typeof projectNum === 'undefined')
      return false
    if (typeof rnumberNum === 'undefined')
      return this.reportData[projectNum].ProjectData.some((row) => row.hidden)

    return this.reportData[projectNum].ProjectData[rnumberNum].RnumberData.some((row) => row.hidden)
  }

  updateShownData(): void {
    this.shownData = []
    for (let reportRow of this.reportData) {
      let ProjectData: RnumberData[] = []

      for (let projectRow of reportRow.ProjectData) {
        if (!projectRow.hidden) {
          let RnumberData: IncomeRnumberRow[] = []
          for (let row of projectRow.RnumberData) {
            if (!row.hidden)
              RnumberData.push(row)
          }
          ProjectData.push({ Rnumber: projectRow.Rnumber, RnumberData: RnumberData, hidden: false })
        }
      }
      this.shownData.push({ ProjectData: ProjectData, ProjectName: reportRow.ProjectName })
    }

    this.updating = false
  }

}
