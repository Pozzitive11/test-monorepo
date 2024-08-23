import { Component } from '@angular/core'
import {
  DcPromotionsFiltersTableModalComponent
} from '../dc-promotion-table-filters-modal/dc-promotion-table-filters-modal.component'
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component'
import { DcSendingDocsTableComponent } from '../dc-sending-docs-table/dc-sending-docs-table.component'
import {
  DcSendingDocsTableFiltersComponent
} from '../dc-sending-docs-table-filters/dc-sending-docs-table-filters.component'
import { NgxSpinnerModule } from 'ngx-spinner'

@Component({
  selector: 'dc-sending-docs-table-wrapper',
  templateUrl: './dc-sending-docs-table-wrapper.component.html',
  standalone: true,
  imports: [NgxSpinnerModule, DcSendingDocsTableFiltersComponent, DcSendingDocsTableComponent, PaginationComponent, DcPromotionsFiltersTableModalComponent]
})
export class DcSendingDocsTableWrapperComponent {}
