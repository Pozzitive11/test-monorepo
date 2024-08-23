import { Component, inject } from '@angular/core'
import { DatepickerService } from '../../../../shared/components/datepicker/datepicker.service'
import { CcFiltersService } from '../../services/cc-filters.service'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { InputFilterParameters } from '../../models/filters.model'
import { CcIncomeDataService } from '../../services/cc-income-data.service'
import {
  IncomeRnumberTableComponent
} from '../../components/report-tables/income-rnumber-table/income-rnumber-table.component'
import { IncomeDateTableComponent } from '../../components/report-tables/income-date-table/income-date-table.component'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { NgIf } from '@angular/common'
import { ReestrComponent } from '../../components/filters/reestr/reestr.component'
import { ReestrStatusComponent } from '../../components/filters/reestr-status/reestr-status.component'
import { ReestrTypeComponent } from '../../components/filters/reestr-type/reestr-type.component'
import { InvestProjectComponent } from '../../components/filters/invest-project/invest-project.component'
import { ProjectComponent } from '../../components/filters/project/project.component'
import { ProjectManagerComponent } from '../../components/filters/project-manager/project-manager.component'
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker.component'


@Component({
  selector: 'cc-income-page',
  templateUrl: './cc-income-page.component.html',
  standalone: true,
  imports: [
    DatepickerComponent,
    ProjectManagerComponent,
    ProjectComponent,
    InvestProjectComponent,
    ReestrTypeComponent,
    ReestrStatusComponent,
    ReestrComponent,
    NgIf,
    LoadingSpinnerComponent,
    IncomeDateTableComponent,
    IncomeRnumberTableComponent
  ]
})
export class CcIncomePageComponent {
  private datepickerService = inject(DatepickerService)
  private ccFilters = inject(CcFiltersService)
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)
  private dataService = inject(CcIncomeDataService)

  loading: boolean = false

  isDateFirst: boolean = false

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

    const input_data: InputFilterParameters = {
      Rnumber: this.ccFilters.selectedRnumbers,
      StartDate: this.datepickerService.getFromDate(),
      EndDate: this.datepickerService.getToDate(),
      isInvestProjects: this.isInvestProjectOnly
    }
    this.httpService.getIncomeReport(input_data)
      .subscribe({
        next: reportData => {
          this.dataService.reportData = reportData
          this.updateReport()
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


  updateReport() {
    this.dataService.updateReport(this.isDateFirst)
  }
}
