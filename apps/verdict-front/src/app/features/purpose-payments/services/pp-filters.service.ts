import { inject, Injectable, signal } from '@angular/core'
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { Subject } from 'rxjs'
import { isDictionaryFullModel } from '../../../shared/models/dictionary-full.model'
import { FilterModel } from '../../../shared/models/filter.model'
import { MessageHandlingService } from '../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../shared/utils/util.functions'
import { PpLayoutModel } from '../models/pp-layout.model'
import { columnNames, operationTypes, unexAccounts, unexSourceName } from '../pp-constants'
import { PpHttpClientService } from './pp-http-client.service'
import { PpTableDataService } from './pp-table-data.service'


@Injectable({
  providedIn: 'root'
})
export class PpFiltersService {
  private readonly dataService = inject(PpTableDataService)
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly calendar = inject(NgbCalendar)

  // pages stuff
  page: number = 1
  maxRowsPerPage: number = 30

  // filters stuff
  header: string[] = []
  hideIds: string[] = []
  hiddenCols: string[] = ['Варианты', 'DFid']
  dataLength: number = 0

  sortingFilters: { col: string, ascending: boolean }[] = []
  filters: { col: string, filter: FilterModel }[] = []

  // global filters stuff
  updating = signal(false)

  fromDate = signal<NgbDate | null>(null)
  toDate = signal<NgbDate | null>(null)
  minDate = signal<NgbDate | null>(null)
  maxDate = signal<NgbDate | null>(null)

  bufferType: string = 'Розібрані та нерозібрані'
  all_files: string[] = []
  chosen_files: string[] = []

  shownData: { [key: string]: any }[] = []
  dataTypes: { [key: string]: any } = {}
  dataUpdate = new Subject<{ [key: string]: any }[]>()
  textFilter: string = ''
  showUnex: boolean = true

  layoutName: string = 'Без назви'
  settingsList = [
    { name: 'Приховані стовпці', id: 'hiddenCols', selected: true },
    { name: 'Сортування стовпців', id: 'sortingFilters', selected: true },
    { name: 'Фільтри', id: 'filters', selected: true },
    { name: 'Відображання платежів Юнекс', id: 'showUnex', selected: true }
  ]
  userLayouts$ = this.httpService.loadUserLayouts()

  loadGlobalFilters(selectFilters: boolean = false) {
    this.updating.set(true)
    this.httpService.getGlobalFilters(this.dataService.processType)
      .subscribe({
        next: filters => {
          if (selectFilters) {
            this.all_files = filters.files
            this.fromDate.set(UtilFunctions.createNgbDateFromString(filters.min_date || null) || this.calendar.getToday())
            this.toDate.set(UtilFunctions.createNgbDateFromString(filters.max_date || null) || this.calendar.getToday())
          }
          this.minDate.set(UtilFunctions.createNgbDateFromString(filters.min_date || null) || this.calendar.getToday())
          const maxDate = UtilFunctions.createNgbDateFromString(filters.max_date || null) || this.calendar.getToday()
          this.maxDate.set(this.calendar.getNext(maxDate, 'd', 1))
        },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.updating.set(false)
        },
        complete: () => this.updating.set(false)
      })
  }

  changeDateRange(dates: { fromDate: NgbDate | null; toDate: NgbDate | null }) {
    this.fromDate.set(dates.fromDate)
    this.toDate.set(dates.toDate)
  }

  checkDataType(col: string) {
    let data = this.dataService.getData()
    if (data.length === 0)
      return 'undefined'

    const allTypes = [
      ...new Set(data.map(value => {
        if (isDictionaryFullModel(value[col]))
          return 'string'
        else if (Array.isArray(value[col]))
          return 'array'
        return typeof value[col]
      }))
    ]
    return allTypes.length === 1 ? allTypes[0] : 'mixed'
  }


  filterData(): void {
    this.dataTypes = {}
    let data = this.dataService.getData()

    if (data.length > 0) {
      this.header = Object.keys(data[0]).filter(value => !this.hiddenCols.includes(value))
      for (let key in data[0])
        this.dataTypes[key] = this.checkDataType(key)
    }

    if (!this.showUnex) {
      data = data.filter(row => {
        const operation = row[columnNames.operationType]
        const account = row[columnNames.ourAccount]
        const sourceName = row[columnNames.sourceName]

        return (
          typeof operation === 'string' && operation === operationTypes.credit &&
          typeof sourceName === 'string' && !sourceName.toLowerCase().includes(unexSourceName) &&
          typeof account === 'string' && !unexAccounts.includes(account)
        )
      })
    }

    this.shownData = UtilFunctions.filterDataExtended(data.slice(), this.filters)
    UtilFunctions.sortData(this.shownData, this.sortingFilters)
    this.dataLength = this.shownData.length

    const shownIds = this.shownData.map(value => value['id'])
    this.hideIds = data.filter(value => !shownIds.includes(value['id'])).map(value => value['id'])

    this.changePage()

    this.dataService.dataIsLoading$.next(false)
  }

  changePage() {
    this.correctPage()

    this.dataUpdate.next(
      this.shownData.slice(
        this.maxRowsPerPage * (this.page - 1),
        this.maxRowsPerPage * this.page
      )
    )

    this.dataService.dataIsLoading$.next(false)
  }

  totalPages(): number {
    return Math.floor(this.dataLength / this.maxRowsPerPage) + (this.dataLength % this.maxRowsPerPage ? 1 : 0)
  }

  correctPage() {
    const totPages = this.totalPages()
    if (totPages < this.page)
      this.page = totPages
    if (this.page < 1)
      this.page = 1
  }

  showHideCol(col: string, show: boolean) {
    if (!show)
      this.hiddenCols.push(col)
    else
      this.hiddenCols = this.hiddenCols.filter(val => val !== col)
  }

  saveLayout() {
    const layout: PpLayoutModel = {
      name: this.layoutName,
      hiddenCols: this.hiddenCols,
      sortingFilters: this.sortingFilters,
      filters: this.filters,
      showUnex: this.showUnex
    }
    this.settingsList.filter(val => !val.selected).forEach(val => {
      switch (val.id) {
        case 'hiddenCols':
          layout.hiddenCols = null
          break
        case 'sortingFilters':
          layout.sortingFilters = null
          break
        case 'filters':
          layout.filters = null
          break
        case 'showUnex':
          layout.showUnex = null
          break
      }
    })

    this.httpService.saveLayout(layout)
      .subscribe({
        next: (info) => this.messageService.sendInfo(info.description),
        error: err => this.messageService.sendError(err.error.detail)
      })
  }

  loadLayout(layoutName: string) {
    this.dataService.dataIsLoading$.next(true)

    this.httpService.loadLayout(layoutName)
      .subscribe({
        next: layout => {
          this.layoutName = layout.name
          if (layout.hiddenCols !== null)
            this.hiddenCols = layout.hiddenCols
          if (layout.sortingFilters !== null)
            this.sortingFilters = layout.sortingFilters
          if (layout.filters !== null)
            this.filters = layout.filters
          if (layout.showUnex !== null)
            this.showUnex = layout.showUnex

          setTimeout(() => this.filterData(), 50)
        },
        error: err => {
          this.messageService.sendError(err.error.detail)
          this.dataService.dataIsLoading$.next(false)
        }
      })
  }
}
