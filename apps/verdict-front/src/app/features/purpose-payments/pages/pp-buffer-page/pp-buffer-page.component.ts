import { Component, inject, OnInit, TemplateRef } from '@angular/core'
import { NgbModal, NgbOffcanvas, NgbPagination, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { PpGlobalFiltersComponent } from '../../components/pp-global-filters/pp-global-filters.component'
import { ProcessTypes } from '../../models/process-types'
import { PpFiltersService } from '../../services/pp-filters.service'
import { PpRowMarksService } from '../../services/pp-row-marks.service'
import { PpTableDataService } from '../../services/pp-table-data.service'
import { SearchableListComponent } from '../../../../shared/components/searchable-list/searchable-list.component'
import { FormsModule } from '@angular/forms'
import { PpTableComponent } from '../../components/pp-table/pp-table.component'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import {
  PpPaymentUpdateErrorsComponent
} from '../../components/pp-payment-update-errors/pp-payment-update-errors.component'
import {
  FileUploadButtonComponent
} from '../../../../shared/components/file-upload-button/file-upload-button.component'
import { DefaultDropdownComponent } from '../../../../shared/components/default-dropdown/default-dropdown.component'
import { AsyncPipe, NgIf } from '@angular/common'
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component'

@Component({
  selector: 'pp-buffer-page',
  templateUrl: './pp-buffer-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    DefaultDropdownComponent,
    FileUploadButtonComponent,
    NgbPagination,
    PpPaymentUpdateErrorsComponent,
    SwitchCheckboxComponent,
    PpTableComponent,
    FormsModule,
    SearchableListComponent,
    AsyncPipe,
    LoadingBarComponent
  ]
})
export class PpBufferPageComponent implements OnInit {
  private readonly offCanvasService = inject(NgbOffcanvas)
  private readonly modalService = inject(NgbModal)
  private readonly dataService = inject(PpTableDataService)
  private readonly rowMarksService = inject(PpRowMarksService)
  private readonly messageService = inject(MessageHandlingService)
  readonly filterService = inject(PpFiltersService)

  get settings() {
    return this.filterService.settingsList.map(s => s.name)
  }

  get selectedSettings() {
    return this.filterService.settingsList.filter(s => s.selected).map(s => s.name)
  }

  set selectedSettings(value) {
    this.filterService.settingsList.forEach(s => s.selected = value.includes(s.name))
  }

  get showUnex() { return this.filterService.showUnex }

  set showUnex(value) {
    this.filterService.showUnex = value
    this.dataService.dataIsLoading$.next(true)
    setTimeout(() => this.filterService.filterData(), 50)
  }

  // для событий когда нужно показать спиннер вместо таблицы
  dataLoading$ = this.dataService.dataIsLoading$

  get processType(): string {
    return this.dataService.processType
  }

  set processType(value) {
    this.dataService.processType = value
  }

  get processTypes(): string[] {
    return Object.values(ProcessTypes)
  }

  get wasChanged() {
    return this.dataService.wasChanged
  }

  get rowsSelected(): boolean {
    return this.selectedIds.length > 0
  }

  get selectedIds() {
    return this.rowMarksService.listNoAll(this.filterService.hideIds)
  }

  ngOnInit(): void {
    this.filterService.loadGlobalFilters(true)
  }

  openGlobalFilters() {
    this.offCanvasService.open(
      PpGlobalFiltersComponent,
      {
        panelClass: 'off-canvas-large'
      }
    )
  }

  updateProcessType(type: string) {
    if (type !== this.processType) {
      this.processType = type
      this.filterService.loadGlobalFilters(true)
    }
  }

  saveChanges() {
    this.dataService.saveChanges()
  }

  resetChanges() {
    this.dataService.resetChanges()
    this.dataService.uploadData(
      this.filterService.chosen_files,
      UtilFunctions.formatNgbDate(this.filterService.fromDate()),
      UtilFunctions.formatNgbDate(this.filterService.toDate()),
      this.filterService.bufferType
    )
  }

  downloadFileFromIds() {
    this.dataService.getFileWithSelectedIds(this.selectedIds)
  }

  sendUploadedIds(files: FileList | null) {
    if (!files)
      return
    if (files.length > 1) {
      this.messageService.sendError('Необхідно обрати один файл. Обробка кількох файлів одночасно не підтримується')
      return
    }

    const file = files[0]
    if (!file.name.endsWith('.xlsx')) {
      this.messageService.sendError('Необхідно обрати Excel-файл. Обраний тип файлу не підтримується')
      return
    }
    const formData = new FormData()
    formData.append('file', file)

    this.dataService.updatePaymentIds(formData)
  }

  autoUpdatePaymentIds() {
    this.dataService.autoUpdatePaymentIds(this.selectedIds)
  }

  goToPage(page: number) {
    this.filterService.page = page
    this.dataService.dataIsLoading$.next(true)
    setTimeout(() => this.filterService.changePage(), 50)
  }

  openSaveLayoutModal(saveLayoutModal: TemplateRef<any>) {
    this.modalService.open(saveLayoutModal).result.then(
      () => this.filterService.saveLayout(),
      () => {}
    )
  }

  openLoadLayout(selectLayoutModal: TemplateRef<any>) {
    this.modalService.open(selectLayoutModal)
  }
}
