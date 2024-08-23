import { Component, inject } from '@angular/core'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { DcPromotionsDataService } from '../../services/dc-promotions-data.service'
import { DcPromotionsFiltersService } from '../../services/dc-promotions-filters.service'
import { DcTemplatesService } from '../../services/dc-templates.service'
import { combineLatest, map, tap } from 'rxjs'
import { dcAgreeInfoType } from '../../models/dc-agree-info.type'
import {
  DcPromotionsFiltersTableModalComponent
} from '../dc-promotion-table-filters-modal/dc-promotion-table-filters-modal.component'
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap'
import { DcPromotionsTableComponent } from '../dc-promotions-table/dc-promotions-table.component'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { DcPromotionsTableFiltersComponent } from '../dc-promotions-table-filters/dc-promotions-table-filters.component'

@Component({
  selector: 'dc-promotions-table-wrapper',
  templateUrl: './dc-promotions-table-wrapper.component.html',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    DcPromotionsTableFiltersComponent,
    NgIf,
    DcPromotionsTableComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgFor,
    NgbDropdownItem,
    DcPromotionsFiltersTableModalComponent,
    AsyncPipe
  ]
})
export class DcPromotionsTableWrapperComponent {
  readonly spinner = inject(NgxSpinnerService)
  private readonly dataService = inject(DcPromotionsDataService)
  private readonly filterService = inject(DcPromotionsFiltersService)
  private readonly templateService = inject(DcTemplatesService)

  get rowsAreChecked(): boolean { return this.filterService.checkedRows.length > 0 }

  get agreeInfoTypes() { return this.dataService.agreeInfoTypes }

  get header() { return this.dataService.header }

  loading$ = combineLatest([this.templateService.loading$, this.filterService.loading$])
    .pipe(
      map(([loading1, loading2]) => loading1 || loading2),
      tap((loading) => loading ? this.spinner.show() : this.spinner.hide())
    )

  sendToAgreement() {
    this.filterService.loading$.next(true)
    this.dataService.sendToAgreement(this.filterService.checkedRows)
  }

  isChecked() {
    return !!this.dataService.allSubmittedIds().filter(value => this.filterService.checkedRows.includes(value)).length
  }

  isCheckedForAgree() {
    return !!this.dataService.allNotAgreedIds().filter(value => this.filterService.checkedRows.includes(value)).length
  }

  markApproved(agreeInfoType: dcAgreeInfoType) {
    this.filterService.loading$.next(true)
    this.dataService.agreeInfoType = agreeInfoType
    this.dataService.markAgreed(this.filterService.checkedRows)
  }

  makeExcel() {
    this.filterService.loading$.next(true)
    this.dataService.makeExcel(this.filterService.checkedRows)
  }
}
