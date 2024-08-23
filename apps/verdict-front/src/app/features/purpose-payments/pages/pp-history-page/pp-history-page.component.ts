import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { PpHttpClientService } from '../../services/pp-http-client.service'
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { PpTableDataService } from '../../services/pp-table-data.service'
import { ProcessTypes } from '../../models/process-types'
import {
  DatePickerRangePopupComponent
} from '../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import {
  TableWithFiltersComponent
} from '../../../../shared/components/table-with-filters/table-with-filters.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TTable } from '../../../../shared/models/basic-types'
import { ErrorModel } from '../../../../shared/models/error.model'
import { finalize } from 'rxjs'

@Component({
  selector: 'app-pp-history-page',
  templateUrl: './pp-history-page.component.html',
  standalone: true,
  imports: [
    DefaultDropdownComponent,
    DatePickerRangePopupComponent,
    TableWithFiltersComponent
  ]
})
export class PpHistoryPageComponent implements OnInit {
  private httpService = inject(PpHttpClientService)
  private dataService = inject(PpTableDataService)
  private messageService = inject(MessageHandlingService)
  private calendar = inject(NgbCalendar)
  private readonly destroy$ = inject(DestroyRef)

  dates: { fromDate: NgbDate | null; toDate: NgbDate | null } = {
    fromDate: this.calendar.getPrev(this.calendar.getToday(), 'm', 1),
    toDate: this.calendar.getToday()
  }
  datesRange: { MinDate: NgbDate | null, MaxDate: NgbDate | null } = {
    MinDate: this.calendar.getPrev(this.calendar.getToday(), 'm', 1),
    MaxDate: this.calendar.getToday()
  }

  historyData = signal<TTable>([])
  loading = signal<boolean>(false)

  get processType(): string {
    return this.dataService.processType
  }

  set processType(value) {
    this.dataService.processType = value
  }

  get processTypes(): string[] {
    return Object.values(ProcessTypes)
  }

  ngOnInit(): void {
    this.getDatesRange()
    this.updateData()
  }

  getDatesRange() {
    this.httpService.getHistoryDates(this.dataService.processType)
      .subscribe({
        next: dates => this.datesRange = {
          MinDate: UtilFunctions.createNgbDateFromString(dates.MinDate),
          MaxDate: UtilFunctions.createNgbDateFromString(dates.MaxDate)
        },
        error: err => this.messageService.sendError(err.error.detail)
      })
  }

  updateData() {
    const { fromDate, toDate } = this.dates
    const dateFilter = {
      minDate: fromDate ? UtilFunctions.formatNgbDate(fromDate) : fromDate,
      maxDate: toDate ? UtilFunctions.formatNgbDate(toDate) : toDate,
      processingType: this.dataService.processType
    }
    this.loading.set(true)
    this.httpService.getHistory(dateFilter)
      .pipe(takeUntilDestroyed(this.destroy$), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.historyData.set(data),
        error: async (err: ErrorModel) => await this.messageService.alertError(err)
      })
  }

  updateProcessType(newType: string) {
    this.processType = newType
    this.updateData()
  }
}
