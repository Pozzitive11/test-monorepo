import { Component, computed, inject, OnInit } from '@angular/core'
import { DcPromotionsDocsRequestsService } from '../../services/dc-promotions-docs-requests.service'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { NavigationService } from '../../../../core/services/navigation.service'
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import {
  MaxPageRowsFilterComponent
} from '../../../../shared/components/max-page-rows-filter/max-page-rows-filter.component'
import { NgbPagination, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-dc-promotions-docs-requests-page',
  templateUrl: './dc-promotions-docs-requests-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    MaxPageRowsFilterComponent,
    SwitchCheckboxComponent,
    NgFor,
    NgbPagination,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class DcPromotionsDocsRequestsPageComponent implements OnInit {
  readonly requestsService = inject(DcPromotionsDocsRequestsService)
  readonly navigationService = inject(NavigationService)
  private readonly promotionsDataService = inject(DcPromotionsDataService)

  allSelected = computed(() => {
    return this.requestsService.selectedRequestIds().length === this.requestsService.docsRequests().length
  })

  get loading() { return this.requestsService.loading }

  ngOnInit(): void {
    this.reloadInfo()
  }

  goToPage(pageNum: number) {
    this.requestsService.currentPage.set(pageNum)
    if (this.requestsService.totalRequests() > 0)
      this.requestsService.loadDocsRequests()
    else
      this.requestsService.docsRequests.set([])
  }

  reloadInfo() {
    this.requestsService.selectedRequestIds.set([])
    this.requestsService.loadDocsRequestsInfo(() => this.goToPage(1))
  }

  reloadPage() {
    this.requestsService.loadDocsRequests()
  }

  toggleAll() {
    if (this.allSelected())
      this.requestsService.selectedRequestIds.set([])
    else
      this.requestsService.selectedRequestIds.set(this.requestsService.docsRequests().map(r => r.ReqId))
  }

  toggleRequestSelection(id: number) {
    const selected = [...this.requestsService.selectedRequestIds()]
    const index = selected.indexOf(id)

    if (index === -1)
      selected.push(id)
    else
      selected.splice(index, 1)

    this.requestsService.selectedRequestIds.set(selected)
  }

  loadTemplatesTable() {
    this.navigationService.navigate('/discounts/promotions_table/templates')

    this.promotionsDataService.uploadDataFromIds(
      this.requestsService.docsRequests()
        .filter(r => this.requestsService.selectedRequestIds().includes(r.ReqId))
        .map(r => r.id)
    )
    this.requestsService.checkDocumentRequests()
  }
}
