import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { SortableTable } from '../../../abstract-classes/sortable-table.class'
import { EverydayCCWorkDateRow, EverydayCCWorkDateTable } from '../../../models/report-models'
import { Subscription } from 'rxjs'
import { CcEdWorkDataService } from '../../../services/cc-ed-work-data.service'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'


interface ProjectData {
  ADate: Date | string
  ADateData: EverydayCCWorkDateRow[]
  hidden: boolean
}


@Component({
  selector: 'app-cc-ed-work-date-table',
  templateUrl: './cc-ed-work-date-table.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class CcEdWorkDateTableComponent implements OnInit, OnDestroy, SortableTable {
  dataService = inject(CcEdWorkDataService)

  header: string[] = [
    'Проєкт',
    'Дата',
    'Номер реєстру',
    'Кількість РТР',
    'Сума РТР',
    'Комісія, %',
    'Дохід за сумою поставлених РТР',
    'Кількість RPC',
    'РТР/RPC %',
    'Кількість нових РТР',
    'Сума нових РТР, грн',

    'Дзвінок вх.',
    'Дзвінок вих. (авт.)',
    'Дзвінок вих. (руч.)',
    'Всього'
  ]
  reportData: EverydayCCWorkDateTable[] = []
  reportData$?: Subscription

  shownData: EverydayCCWorkDateTable[] = []
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

  countColumnLength(row: ProjectData | EverydayCCWorkDateTable): number {
    return 'ADateData' in row ?
      row.ADateData.length :
      row.ProjectData.reduce((acc, val) => acc + val.ADateData.length, 0)
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
            if (!dateRow.ADate.toString().includes('Всього'))
              dateRow.hidden = !state
          })
        })
        break
      }

      case 'Дата': {
        let state: boolean = this.reportData[0].ProjectData[0].ADateData[0].hidden

        this.reportData.forEach((projectRow) => {
          if (projectRow.ProjectName.includes('Всього'))
            return

          projectRow.ProjectData.forEach((dateRow) => {
            if (dateRow.ADate.toString().includes('Всього'))
              return

            dateRow.ADateData.forEach((row) => {
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
        if (dateRow.ADate.toString().includes('Всього'))
          continue
        if (projectNum === i && typeof dateNum === 'undefined')
          dateRow.hidden = !dateRow.hidden

        for (let row of dateRow.ADateData) {
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

    return this.reportData[projectNum].ProjectData[rnumberNum].ADateData.some((row) => row.hidden)
  }

  updateShownData(): void {
    this.shownData = []
    for (let reportRow of this.reportData) {
      let ProjectData: ProjectData[] = []

      for (let projectRow of reportRow.ProjectData) {
        if (!projectRow.hidden) {
          let ADateData: EverydayCCWorkDateRow[] = []
          for (let row of projectRow.ADateData) {
            if (!row.hidden)
              ADateData.push(row)
          }
          ProjectData.push({ ADate: projectRow.ADate, ADateData: ADateData, hidden: false })
        }
      }
      this.shownData.push({ ProjectData: ProjectData, ProjectName: reportRow.ProjectName })
    }

    this.updating = false
  }

}
