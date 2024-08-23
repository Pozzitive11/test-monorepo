import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SortableTable } from '../../../abstract-classes/sortable-table.class'
import { IncomeDateRow, IncomeDateTable } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcIncomeDataService } from '../../../services/cc-income-data.service'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'


interface DateData {
  DatePay: Date | string
  DatePayData: IncomeDateRow[]
  hidden: boolean
}

@Component({
  selector: 'app-income-date-table',
  templateUrl: './income-date-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class IncomeDateTableComponent implements OnInit, OnDestroy, SortableTable {
  private dataService = inject(CcIncomeDataService)

  header: string[] = [
    'Проєкт',
    'Дата',
    'Номер реєстру',

    'Комісія, %',
    'Сума збору , грн',
    'Сума доходу, грн',
    'Дата оновлення оплат'
  ]
  reportData: IncomeDateTable[] = []
  reportData$?: Subscription

  shownData: IncomeDateTable[] = []
  updating: boolean = false

  ngOnInit(): void {
    this.reportData$ = this.dataService.dateData
      .subscribe({
        next: report => {
          this.reportData = report
          this.updating = true
          setTimeout(() => this.updateShownData())
        }
      })
  }

  ngOnDestroy(): void {
    this.reportData$?.unsubscribe()
  }

  changeSortType(_: string): void {}

  countColumnLength(row: DateData | IncomeDateTable): number {
    return 'DatePayData' in row ?
      row.DatePayData.length :
      row.ProjectData.reduce((acc, val) => acc + val.DatePayData.length, 0)
  }

  hideAllColumn(column: string): void {
    if (!['Проєкт', 'Дата'].includes(column))
      return

    this.updating = true

    switch (column) {
      case 'Проєкт': {
        let state: boolean = this.reportData[0].ProjectData[0].hidden

        this.reportData.forEach((projectRow) => {
          if (projectRow.ProjectName.includes('Всього'))
            return

          projectRow.ProjectData.forEach((dateRow) => {
            if (!dateRow.DatePay.toString().includes('Всього'))
              dateRow.hidden = !state
          })
        })
        break
      }

      case 'Дата': {
        let state: boolean = this.reportData[0].ProjectData[0].DatePayData[0].hidden

        this.reportData.forEach((projectRow) => {
          if (projectRow.ProjectName.includes('Всього'))
            return

          projectRow.ProjectData.forEach((dateRow) => {
            if (dateRow.DatePay.toString().includes('Всього'))
              return

            dateRow.DatePayData.forEach((row) => {
              if (!row.Rnumber.toString().includes('Всього'))
                row.hidden = !state
            })
          })
        })
        break
      }
    }

    setTimeout(() => this.updateShownData())
  }

  hideRow(projectNum?: number, dateNum?: number): void {
    this.updating = true
    let i: number = 0

    for (let projectRow of this.reportData) {
      let j: number = 0
      if (projectRow.ProjectName.includes('Всього'))
        continue

      for (let dateRow of projectRow.ProjectData) {
        if (dateRow.DatePay.toString().includes('Всього'))
          continue
        if (projectNum === i && typeof dateNum === 'undefined')
          dateRow.hidden = !dateRow.hidden

        for (let row of dateRow.DatePayData) {
          if (projectNum === i && dateNum === j && !row.Rnumber.toString().includes('Всього'))
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

    return this.reportData[projectNum].ProjectData[rnumberNum].DatePayData.some((row) => row.hidden)
  }

  updateShownData(): void {
    this.shownData = []
    for (let reportRow of this.reportData) {
      let ProjectData: DateData[] = []

      for (let projectRow of reportRow.ProjectData) {
        if (!projectRow.hidden) {
          let DatePayData: IncomeDateRow[] = []
          for (let row of projectRow.DatePayData) {
            if (!row.hidden)
              DatePayData.push(row)
          }
          ProjectData.push({ DatePay: projectRow.DatePay, DatePayData: DatePayData, hidden: false })
        }
      }
      this.shownData.push({ ProjectData: ProjectData, ProjectName: reportRow.ProjectName })
    }

    this.updating = false
  }

}
