import { Component, inject, Input } from '@angular/core'
import { CcFiltersService } from '../../services/cc-filters.service'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { InputCCMailsModel } from '../../models/filters.model'
import { CCMailsModel, CCMailsRowModel, CCMailsTableModel } from '../../models/report-models'
import { round } from '@popperjs/core/lib/utils/math'
import {
  TemplateMailsTableComponent
} from '../../components/report-tables/template-mails-table/template-mails-table.component'
import {
  DefaultMailsTableComponent
} from '../../components/report-tables/default-mails-table/default-mails-table.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { ReestrComponent } from '../../components/filters/reestr/reestr.component'
import { ReestrStatusComponent } from '../../components/filters/reestr-status/reestr-status.component'
import { ReestrTypeComponent } from '../../components/filters/reestr-type/reestr-type.component'
import { InvestProjectComponent } from '../../components/filters/invest-project/invest-project.component'
import { ProjectComponent } from '../../components/filters/project/project.component'
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component'
import { FormsModule } from '@angular/forms'
import { NgFor, NgIf } from '@angular/common'
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive'

@Component({
  selector: 'cc-mails-report-page',
  templateUrl: './cc-mails-report-page.component.html',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    NgFor,
    FormsModule,
    ProjectManagerComponent,
    ProjectComponent,
    InvestProjectComponent,
    ReestrTypeComponent,
    ReestrStatusComponent,
    ReestrComponent,
    NgIf,
    LoadingSpinnerComponent,
    NgbProgressbar,
    DefaultMailsTableComponent,
    TemplateMailsTableComponent
  ]
})
export class CcMailsReportPageComponent {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  months: { id: number, name: string }[] = [
    { id: 1, name: 'січень' },
    { id: 2, name: 'лютий' },
    { id: 3, name: 'березень' },
    { id: 4, name: 'квітень' },
    { id: 5, name: 'травень' },
    { id: 6, name: 'червень' },
    { id: 7, name: 'липень' },
    { id: 8, name: 'серпень' },
    { id: 9, name: 'вересень' },
    { id: 10, name: 'жовтень' },
    { id: 11, name: 'листопад' },
    { id: 12, name: 'грудень' }
  ]

  @Input() year: number = this.currentYear()
  month: { id: number, name: string } = this.months.filter((month) => new Date().getMonth() + 1 === month.id)[0]
  loading: boolean = false
  updating: boolean = false

  reportData: CCMailsModel[] = []
  processedData?: CCMailsTableModel
  hiddenRows: number[] = []
  isTemplatesFirst: boolean = false

  payDayStart: number = 4
  payDayEnd: number = 34

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

    const input_data: InputCCMailsModel = {
      Year: this.year,
      Month: this.month.id,
      payDayStart: this.payDayStart,
      payDayEnd: this.payDayEnd,
      RNumber: this.ccFilters.selectedRnumbers,
      isInvestProjects: this.isInvestProjectOnly
    }
    this.httpService.getCCMailsReport(input_data)
      .subscribe({
        next: reportData => {
          this.reportData = reportData
          this.hiddenRows = []
          this.updating = true
          this.isTemplatesFirst ?
            setTimeout(() => { this.calculateTemplateGroupingData(reportData) }) :
            setTimeout(() => { this.calculateProjectGroupingData(reportData) })
        },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.loading = false
        },
        complete: () => { this.loading = false }
      })
  }

  allFiltersSelected() {
    return this.ccFilters.selectedRnumbers.length > 0
  }

  toggleIsActual() {
    this.isActual = !this.isActual
    this.ccFilters.isActualChanged(this.isActual)
  }

  switchReestrMode() {
    this.isInvestProjectOnly = !this.isInvestProjectOnly

    this.ccFilters.switchReestrMode()
  }

  // MAILS REPORT THINGS

  currentYear(): number {
    return (new Date()).getFullYear()
  }

  scrollMonth($event: WheelEvent) {
    if (this.month.id + round(-$event.deltaY / 100) < 1 || this.month.id + round(-$event.deltaY / 100) > 12) {
      return
    }
    this.month = this.months.filter(
      (month) => {
        return this.month.id + round(-$event.deltaY / 100) === month.id
      }
    )[0]
  }

  setMonth(mon: { id: number, name: string }) {
    this.month = mon
  }

  toggleShow(dropMenu: HTMLUListElement) {
    dropMenu.classList.contains('show') ? dropMenu.classList.remove('show') : dropMenu.classList.add('show')
  }

  processReportData() {
    if (this.reportData.length === 0) return

    this.updating = true
    let reportData: CCMailsModel[] = []

    if (!this.isTemplatesFirst) {
      reportData = this.reportData.sort(
        (a, b) => {
          return a.TemplateName < b.TemplateName ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.RNumber < b.RNumber ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.ProjectName < b.ProjectName ? -1 : 1
        }
      )

      setTimeout(() => { this.calculateProjectGroupingData(reportData) })
    } else {
      reportData = this.reportData.sort(
        (a, b) => {
          return a.RNumber < b.RNumber ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.ProjectName < b.ProjectName ? -1 : 1
        }
      ).sort(
        (a, b) => {
          return a.TemplateName < b.TemplateName ? -1 : 1
        }
      )

      setTimeout(() => { this.calculateTemplateGroupingData(reportData) })
    }

  }

  private calculateProjectGroupingData(reportData: CCMailsModel[]) {
    const column_names = [
      'Проєкт',
      'Реєстр',
      'Шаблон листа',
      'Дата відправки',
      'Кількість відправлених листів',
      'Сума вимоги',
      'Дата вимоги',
      'Кількість платежів, що надійшли',
      'Сума платежів, що надійшли',
      'Бланк',
      'Відправник листів'
    ]
    let newReportData: CCMailsTableModel = { column_names: column_names, rows: [] }
    let lastRNumber: number | string = reportData[0].RNumber
    let lastProjectName: string = reportData[0].ProjectName

    let i: number = 0
    let RowNum: number = 0
    let ProjectNum: number = 0
    let ReestrNum: number = 0
    for (let row of reportData) {
      newReportData.rows.push({
        ...row,
        ProjectNum: ProjectNum,
        ReestrNum: ReestrNum,
        RowNum: RowNum++
      })

      lastRNumber = row.RNumber
      lastProjectName = row.ProjectName
      if (i + 1 === reportData.length || lastRNumber !== reportData[i + 1].RNumber) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          lastProjectName,
          lastRNumber,
          'Всього за реєстром',
          reportData.filter(
            (r) => { return r.ProjectName === lastProjectName && r.RNumber === lastRNumber }
          )
        ))
        if (!(i + 1 === reportData.length || lastProjectName !== reportData[i + 1].ProjectName))
          ReestrNum++
      }
      if (i + 1 === reportData.length || lastProjectName !== reportData[i + 1].ProjectName) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          lastProjectName,
          'Всього за проєктом',
          '',
          reportData.filter(
            (r) => { return r.ProjectName === lastProjectName }
          )
        ))
        ReestrNum++
        ProjectNum++
      }
      if (i + 1 === reportData.length) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          'Всього',
          '',
          '',
          reportData
        ))
      }
      i++
    }

    this.processedData = newReportData
    this.updating = false
  }

  private calculateTemplateGroupingData(reportData: CCMailsModel[]) {
    const column_names = [
      'Шаблон листа',
      'Проєкт',
      'Реєстр',
      'Дата відправки',
      'Кількість відправлених листів',
      'Сума вимоги',
      'Дата вимоги',
      'Кількість платежів, що надійшли',
      'Сума платежів, що надійшли',
      'Бланк',
      'Відправник листів'
    ]
    let newReportData: CCMailsTableModel = { column_names: column_names, rows: [] }
    let lastTemplate: string = reportData[0].TemplateName
    let lastRNumber: number | string = reportData[0].RNumber
    let lastProjectName: string = reportData[0].ProjectName

    let i: number = 0
    let ProjectNum: number = 0
    let ReestrNum: number = 0
    let RowNum: number = 0
    let TemplateNum: number = 0
    for (let row of reportData) {
      newReportData.rows.push({
        ...row,
        TemplateNum: TemplateNum,
        ProjectNum: ProjectNum,
        ReestrNum: ReestrNum,
        RowNum: RowNum++
      })

      lastRNumber = row.RNumber
      lastProjectName = row.ProjectName
      lastTemplate = row.TemplateName
      if (i + 1 === reportData.length || lastRNumber !== reportData[i + 1].RNumber) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          lastProjectName,
          lastRNumber,
          lastTemplate,
          reportData.filter(
            (r) => {
              return r.ProjectName === lastProjectName && r.RNumber === lastRNumber && r.TemplateName === lastTemplate
            }
          ),
          'Всього за реєстром',
          TemplateNum
        ))
        if (!(i + 1 === reportData.length || lastProjectName !== reportData[i + 1].ProjectName))
          ReestrNum++
      }
      if (i + 1 === reportData.length || lastProjectName !== reportData[i + 1].ProjectName) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          lastProjectName,
          'Всього за проєктом',
          lastTemplate,
          reportData.filter(
            (r) => { return r.ProjectName === lastProjectName && r.TemplateName === lastTemplate }
          ),
          '',
          TemplateNum
        ))
        if (!(i + 1 === reportData.length || lastTemplate !== reportData[i + 1].TemplateName))
          ReestrNum++
        ProjectNum++
      }
      if (i + 1 === reportData.length || lastTemplate !== reportData[i + 1].TemplateName) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          'Всього за шаблоном',
          '',
          lastTemplate,
          reportData.filter(
            (r) => { return r.TemplateName === lastTemplate }
          ),
          '',
          TemplateNum
        ))
        ReestrNum++
        ProjectNum++
        TemplateNum++
      }

      if (i + 1 === reportData.length) {
        newReportData.rows.push(this.totalFromRow(
          RowNum++,
          ProjectNum,
          ReestrNum,
          '',
          '',
          'Всього',
          reportData,
          '',
          TemplateNum
        ))
      }
      i++
    }

    this.processedData = newReportData
    this.updating = false
  }

  private totalFromRow(
    RowNum: number, ProjectNum: number, ReestrNum: number,
    lastProjectName: string, lastRNumber: string | number, TemplateName: string, filteredData: CCMailsModel[],
    ActivityDate?: string, templateNum?: number
  ): CCMailsRowModel {
    return {
      ProjectName: lastProjectName,
      RNumber: lastRNumber,
      TemplateName: TemplateName,
      ActivityDate: ActivityDate ? ActivityDate : '',
      LetterCount: filteredData.reduce((acc, obj) => { return acc + obj.LetterCount }, 0),
      PaymentSum: filteredData.reduce((acc, obj) => { return acc + obj.PaymentSum }, 0),
      PaymentsCount: filteredData.reduce((acc, obj) => { return acc + obj.PaymentsCount }, 0),
      PromiseAmount: filteredData.reduce((acc, obj) => { return acc + obj.PromiseAmount }, 0),
      PromiseDate: '',
      Blank: '',
      Sender: '',
      ProjectNum: ProjectNum,
      ReestrNum: ReestrNum,
      RowNum: RowNum,
      TemplateNum: templateNum
    }
  }

}
