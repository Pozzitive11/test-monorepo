import { Component, inject } from '@angular/core'
import { CcFiltersService } from '../../services/cc-filters.service'
import { IntersectionsINNFilters } from '../../models/filters.model'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { IntersectionsINNModel } from '../../models/report-models'
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import { ReestrComponent } from '../../components/filters/reestr/reestr.component'
import { ReestrStatusComponent } from '../../components/filters/reestr-status/reestr-status.component'
import { ReestrTypeComponent } from '../../components/filters/reestr-type/reestr-type.component'
import { InvestProjectComponent } from '../../components/filters/invest-project/invest-project.component'
import { ProjectComponent } from '../../components/filters/project/project.component'
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component'

@Component({
  selector: 'cc-intersections-inn-page',
  templateUrl: './cc-intersections-inn-page.component.html',
  standalone: true,
  imports: [
    ProjectManagerComponent,
    ProjectComponent,
    InvestProjectComponent,
    ReestrTypeComponent,
    ReestrStatusComponent,
    ReestrComponent,
    NgIf,
    LoadingSpinnerComponent,
    NgFor,
    NgbTooltip,
    DecimalPipe
  ]
})
export class CcIntersectionsInnPageComponent {
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  loading: boolean = false
  reportData: IntersectionsINNModel[] = []

  positive_stop_lists: string[] = [
    'Paid',
    'Solded',
    'Дисконтирован',
    'Mortgage solded',
    'Платежи по реструктуризации',
    'Правэкс РЕСТРУКТУРИЗАЦИЯ',
    'Согласен на реструктуризацию'
  ]

  header: { column: string, description: string }[] = [
    { column: 'Проєкт', description: '' },
    { column: 'ІПН на момент купівлі', description: 'Кількість унікальних ІПН на момент купівлі портфелю' },
    { column: 'НКС на момент купівлі', description: 'Кількість унікальних НКС на момент купівлі портфелю' },
    { column: 'ІПН на сьогодні', description: 'Кількість унікальних ІПН не у вічному стоп-листі на сьогодні' },
    { column: 'НКС на сьогодні', description: 'Кількість унікальних НКС не у вічному стоп-листі на сьогодні' },
    {
      column: 'ІПН без суміжних на сьогодні',
      description: 'Кількість ІПН, що зустрічаються лише один раз і лише в обраному проєкті'
    },
    //в обраних реєстрах проєкту

    {
      column: 'В середині проєкту',
      description: 'Кількість ІПН з проєкту, що зустрічаються більше одного разу в середині проєкту'
    },
    {
      column: 'Факторинг Беззалоги',
      description: 'Кількість ІПН з проєкту, що зустрічаються в інших факторингових беззалогових проєктах'
    },
    {
      column: 'Факторинг Залоги',
      description: 'Кількість ІПН з проєкту, що зустрічаються в інших факторингових залогових проєктах'
    },
    {
      column: 'Комісія',
      description: 'Кількість ІПН з проєкту, що зустрічаються в інших комісіоних проєктах'
    },
    {
      column: 'Вічний стоп-лист (позитивний)',
      description: 'Кількість ІПН з проєкту, що зустрічаються в інших проєктах у наступних вічних стоп-листах: ' +
        this.positive_stop_lists.reduce((prev, cur) => prev + (prev ? ', ' : '') + `"${cur}"`, '')
    },
    {
      column: 'Вічний стоп-лист (негативний)',
      description: 'Кількість ІПН з проєкту, що зустрічаються в інших проєктах у вічних стоп-листах, окрім ' +
        this.positive_stop_lists.reduce((prev, cur) => prev + (prev ? ', ' : '') + `"${cur}"`, '')
    }
  ]

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

    let input_data: IntersectionsINNFilters = {
      RNumbers: this.ccFilters.selectedRnumbers,
      isInvestProjects: this.isInvestProjectOnly
    }
    this.httpService.getIntersectionsINNReport(input_data)
      .subscribe({
        next: reportData => { this.reportData = reportData },
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

  tooltipForTotals(ProjectName: string) {
    if (ProjectName === 'Всього (по обраним реєстрам)')
      return 'Виключені ІПН, що повторюються серед обраних проєктів (кожний унікальний ІПН рахується лише 1 раз)'
    if (ProjectName === 'Всього')
      return 'Сума значень з рядків проєктів (кожен ІПН рахується один раз в межах одного проєкту)'

    return ''
  }

}


