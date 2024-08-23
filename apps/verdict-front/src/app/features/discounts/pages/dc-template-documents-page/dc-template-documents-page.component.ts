import { Component, inject, OnInit } from '@angular/core'
import { NgbDate, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { combineLatest, map, tap } from 'rxjs'
import { NavigationService } from '../../../../core/services/navigation.service'
import { refNumberJournalFunction } from '../../components/dc-templates/dct-journal-modal/ref-number-journal.function'
import { dctTypesShortEnum, dctTypesShortValues } from '../../models/dc-template-models/dct-types.enum'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { DcPromotionsDocsRequestsService } from '../../services/dc-promotions-docs-requests.service'
import { DcPromotionsFiltersService } from '../../services/dc-promotions-filters.service'
import { DcTemplatesService } from '../../services/dc-templates.service'
import { DcPromotionsTableComponent } from '../../components/dc-promotions-table/dc-promotions-table.component'
import { AsyncPipe, NgIf } from '@angular/common'
import { SearchableListComponent } from '../../../../shared/components/searchable-list/searchable-list.component'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { DatePickerRangePopupComponent } from '../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component'

@Component({
  selector: 'dc-template-documents-page',
  templateUrl: './dc-template-documents-page.component.html',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    DatePickerRangePopupComponent,
    SwitchCheckboxComponent,
    SearchableListComponent,
    NgbPagination,
    NgIf,
    DcPromotionsTableComponent,
    AsyncPipe
  ]
})
export class DcTemplateDocumentsPageComponent implements OnInit {
  readonly spinner = inject(NgxSpinnerService)
  private readonly modal = inject(NgbModal)

  private readonly navigationService = inject(NavigationService)
  readonly docsRequestsService = inject(DcPromotionsDocsRequestsService)
  private readonly promotionsDataService = inject(DcPromotionsDataService)
  readonly promotionsFilterService = inject(DcPromotionsFiltersService)

  readonly templateService = inject(DcTemplatesService)

  readonly documentTypes: dctTypesShortValues[] = Object.values(dctTypesShortEnum)

  get datesRange() {
    return this.promotionsFilterService.datesRange
  }

  get dateFilter() {
    return this.promotionsFilterService.dateFilter
  }

  set dateFilter(value: { fromDate: NgbDate | null; toDate: NgbDate | null }) {
    this.promotionsFilterService.dateFilter = value
  }

  loading$ = combineLatest([this.templateService.loading$, this.promotionsFilterService.loading$]).pipe(
    map(([loading1, loading2]) => loading1 || loading2),
    tap((loading) => (loading ? this.spinner.show() : this.spinner.hide()))
  )

  stepMessage: string = 'Обробка...'

  get header() {
    return this.promotionsDataService.header
  }

  get dataLength() {
    return this.promotionsFilterService.shownDataLength
  }

  get page() {
    return this.promotionsFilterService.page
  }

  set page(num) {
    if (num >= 1 && num <= this.promotionsFilterService.maxPage) {
      this.promotionsFilterService.page = num
      this.promotionsFilterService.loading$.next(true)
      this.promotionsDataService.filterData()
    }
  }

  get rowsPerPage() {
    return this.promotionsFilterService.rowsPerPage
  }

  ngOnInit() {
    this.templateService.currentStep.set(0)
    this.promotionsDataService.getDatesRange()
    this.templateService.getRefNumberCompanies()
    this.docsRequestsService.loadDocsRequestsInfo()
    if (this.templateService.selectedDocumentTypes().length === 0)
      this.templateService.selectedDocumentTypes.set([...this.documentTypes])
  }

  loadData() {
    this.promotionsDataService.uploadDataForTemplates(this.dateFilter, this.templateService.selectedDocumentTypes())
  }

  openRefNumbersJournalModal() {
    refNumberJournalFunction(this.modal, this.templateService, this.datesRange, this.dateFilter)
  }

  goToRequestsPage() {
    this.navigationService.navigate('/discounts/promotions_table/requests')
  }

  makeExcel() {
    this.promotionsFilterService.loading$.next(true)
    this.promotionsDataService.makeExcel(this.promotionsFilterService.checkedRows)
  }
  goToClosingCertificatePage() {
    this.navigationService.navigate('/discounts/closing-certificates')
  }
}
