import { Component, inject } from '@angular/core'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import {
  dcPromotionTableApprovedDocumentsColorsNames,
  dcPromotionTableColorsNames
} from '../../models/dc-promotion-table-colors.names'
import { NgbDate, NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { DcPromotionsFiltersService } from '../../services/dc-promotions-filters.service'
import { DcTemplatesService } from '../../services/dc-templates.service'
import {
  DcPromotionsFromContractUploadComponent
} from '../dc-promotions-from-contract-upload/dc-promotions-from-contract-upload.component'
import { combineLatest, map } from 'rxjs'
import { refNumberJournalFunction } from '../dc-templates/dct-journal-modal/ref-number-journal.function'
import { DcHttpService } from '../../services/dc-http.service'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import {
  DatePickerRangePopupComponent
} from '../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component'
import {
  MaxPageRowsFilterComponent
} from '../../../../shared/components/max-page-rows-filter/max-page-rows-filter.component'

@Component({
  selector: 'dc-promotions-table-filters',
  templateUrl: './dc-promotions-table-filters.component.html',
  standalone: true,
  imports: [MaxPageRowsFilterComponent, DatePickerRangePopupComponent, SwitchCheckboxComponent, NgbTooltip, NgIf, NgFor, NgbPagination, AsyncPipe]
})
export class DcPromotionsTableFiltersComponent {
  private readonly dataService = inject(DcPromotionsDataService)
  readonly templateService = inject(DcTemplatesService)
  readonly filterService = inject(DcPromotionsFiltersService)
  readonly httpService = inject(DcHttpService)
  readonly modal = inject(NgbModal)
  readonly promotionsData = inject(DcPromotionsDataService)

  readonly tableColorsNames = dcPromotionTableColorsNames
  readonly approvedDocumentsColorsNames = dcPromotionTableApprovedDocumentsColorsNames

  loading$ = combineLatest([this.templateService.loading$, this.filterService.loading$]).pipe(
    map(([loading1, loading2]) => loading1 || loading2)
  )

  get datesRange() {
    return this.filterService.datesRange
  }

  get dateFilter() {
    return this.filterService.dateFilter
  }

  get agreeTypesFilter() {
    return this.filterService.agreeTypesFilter
  }

  get sendingWaysTypesFilter() {
    return this.filterService.sendingWayTypesFilter
  }

  get approvedDocumentsFilter() {
    return this.filterService.approvedDocumentsFilter
  }

  get rowsAreChecked(): boolean {
    return this.filterService.checkedRows.length > 0
  }

  get dataLength() {
    return this.filterService.shownDataLength
  }

  get page() {
    return this.filterService.page
  }

  set page(num) {
    if (num >= 1 && num <= this.filterService.maxPage) {
      this.filterService.page = num
      this.filterService.loading$.next(true)
      this.dataService.filterData()
    }
  }

  get rowsPerPage() {
    return this.filterService.rowsPerPage
  }

  set rowsPerPage(value: number) {
    this.filterService.rowsPerPage = value
    this.filterService.loading$.next(true)
    this.dataService.filterData()
  }

  toggleAgreeTypeFilter(agreeTypes: string[]) {
    if (this.typeChosen(agreeTypes, this.agreeTypesFilter))
      this.filterService.agreeTypesFilter = this.filterService.agreeTypesFilter.filter(
        (type) => !agreeTypes.includes(type)
      )
    else this.filterService.agreeTypesFilter.push(...agreeTypes)

    this.filterService.loading$.next(true)
    this.dataService.filterData()
  }

  toggleSendingWayTypeFilter(agreeTypes: string[]) {
    if (this.typeChosen(agreeTypes, this.sendingWaysTypesFilter)) {
      this.filterService.sendingWayTypesFilter = this.filterService.sendingWayTypesFilter.filter(
        (type) => !agreeTypes.includes(type)
      )
    } else {
      this.filterService.sendingWayTypesFilter.push(...agreeTypes)
    }

    this.filterService.loading$.next(true)
    this.dataService.filterData()
  }

  toggleApprovedDocumentsTypeFilter(agreeTypes: string[]) {
    if (this.typeChosen(agreeTypes, this.approvedDocumentsFilter)) {
      this.filterService.approvedDocumentsFilter = this.filterService.approvedDocumentsFilter.filter(
        (type) => !agreeTypes.includes(type)
      )
    } else {
      this.filterService.approvedDocumentsFilter.push(...agreeTypes)
    }

    this.filterService.loading$.next(true)
    this.dataService.filterData()
  }

  updateFilter(filter: string) {
    this.filterService.general = false
    this.filterService.documentsVerification = false
    this.filterService.sending = false

    if (filter === 'general') {
      this.filterService.general = true
    } else if (filter === 'documentsVerification') {
      this.filterService.documentsVerification = true
    } else if (filter === 'sending') {
      this.filterService.sending = true
    }

    this.updateFilteredData()
  }

  updateFilteredData() {
    this.filterService.loading$.next(true)
    this.dataService.filterData()
  }

  changeDates(dateFilter: { fromDate: NgbDate | null; toDate: NgbDate | null }) {
    this.filterService.dateFilter = dateFilter
  }

  updateData() {
    this.filterService.loading$.next(true)
    this.dataService.uploadData()
  }

  typeChosen(types: string[], typesFilter: string[]) {
    return types.every((type) => typesFilter.includes(type))
  }

  openContractUploadModal() {
    const modalRef = this.modal.open(DcPromotionsFromContractUploadComponent, {
      size: 'lg',
      centered: true,
      scrollable: true,
      fullscreen: 'sm'
    })

    modalRef.result
      .then(([contractsList, selectLatestOnly]) => {
        this.filterService.loading$.next(true)
        this.dataService.uploadDataFromContractsList(contractsList, selectLatestOnly)
      })
      .catch(() => {})
  }

  openRefNumbersJournalModal() {
    refNumberJournalFunction(this.modal, this.templateService, this.datesRange, this.dateFilter)
  }
}
