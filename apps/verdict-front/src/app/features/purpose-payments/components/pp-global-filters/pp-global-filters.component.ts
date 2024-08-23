import { Component, inject, OnInit } from '@angular/core'
import { NgbActiveOffcanvas, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { PpFiltersService } from '../../services/pp-filters.service'
import { PpHttpClientService } from '../../services/pp-http-client.service'
import { PpTableDataService } from '../../services/pp-table-data.service'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import {
  DatePickerRangePopupComponent
} from '../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component'
import { PpFilesFilterComponent } from '../pp-files-filter/pp-files-filter.component'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import {
  MaxPageRowsFilterComponent
} from '../../../../shared/components/max-page-rows-filter/max-page-rows-filter.component'
import { NgFor, NgIf } from '@angular/common'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'


@Component({
  selector: 'pp-global-filters',
  templateUrl: './pp-global-filters.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    MaxPageRowsFilterComponent,
    DefaultDropdownComponent,
    PpFilesFilterComponent,
    DatePickerRangePopupComponent,
    NgFor,
    SwitchCheckboxComponent,
    LoadingBarComponent
  ]
})
export class PpGlobalFiltersComponent implements OnInit {
  readonly filterService = inject(PpFiltersService)
  private readonly dataService = inject(PpTableDataService)
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)
  readonly activeOffCanvas = inject(NgbActiveOffcanvas)

  withFilters: boolean = true

  get updating() {
    return this.filterService.updating()
  }

  get available_files() {
    return this.filterService.all_files.filter(
      file => !this.chosen_files.includes(file)
    )
  }

  get chosen_files() {
    return this.filterService.chosen_files
  }

  set chosen_files(chosen_files) {
    this.filterService.chosen_files = chosen_files
  }

  get textFilter() {
    return this.filterService.textFilter
  }

  set textFilter(filter) {
    this.filterService.textFilter = filter
  }

  get maxRowsPerPage(): number {
    return this.filterService.maxRowsPerPage
  }

  set maxRowsPerPage(value) {
    this.filterService.maxRowsPerPage = value
    this.dataService.dataIsLoading$.next(true)
    setTimeout(() => this.filterService.filterData())
  }

  preparing: boolean = false
  preparingFilteredFile: boolean = false
  bufferTypes: string[] = [
    'Розібрані та нерозібрані',
    'Лише нерозібрані',
    'Лише розібрані'
  ]

  get currentBufferType(): string {
    return this.filterService.bufferType
  }

  set currentBufferType(bufferType: string) {
    this.filterService.bufferType = bufferType
  }

  get hiddenCols(): string[] {
    return this.filterService.hiddenCols
  }

  ngOnInit(): void {
    this.filterService.loadGlobalFilters()
  }

  // ================================================================= SERVER FUNCTIONS ================================

  uploadData() {
    this.dataService.uploadData(
      this.chosen_files,
      UtilFunctions.formatNgbDate(this.filterService.fromDate()),
      UtilFunctions.formatNgbDate(this.filterService.toDate()),
      this.filterService.bufferType
    )
  }

  resetFilters() {
    this.dataService.dataIsLoading$.next(true)
    this.filterService.filters = []
    this.filterService.sortingFilters = []
    setTimeout(() => this.filterService.filterData())
  }

  prepareUpload() {
    this.preparing = true

    const uploadResponse$ = this.withFilters ? this.dataService.prepareUpload(
      this.chosen_files,
      UtilFunctions.formatNgbDate(this.filterService.fromDate()),
      UtilFunctions.formatNgbDate(this.filterService.toDate()),
      this.filterService.bufferType
    ) : this.dataService.prepareUploadFull()

    uploadResponse$.subscribe({
      next: (file) => { UtilFunctions.downloadXlsx(file, 'For upload.xlsx') },
      error: async err => {
        this.messageService.sendError(JSON.parse(await err.error.text()).detail)
        this.preparing = false
      },
      complete: () => this.preparing = false
    })
  }

  getFileWithFilters() {
    this.preparingFilteredFile = true
    this.httpService.getFileWithFilters(
      this.chosen_files,
      UtilFunctions.formatNgbDate(this.filterService.fromDate()),
      UtilFunctions.formatNgbDate(this.filterService.toDate()),
      this.filterService.bufferType,
      this.dataService.processType
    ).subscribe({
      next: file => UtilFunctions.downloadXlsx(file, `Buffer_`),
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.preparingFilteredFile = false
      },
      complete: () => { this.preparingFilteredFile = false }
    })
  }

  showCol(col: string) {
    this.dataService.dataIsLoading$.next(true)
    this.filterService.showHideCol(col, true)
    setTimeout(() => this.filterService.filterData())
  }
}
