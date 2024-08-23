import { Component, inject, Input, TemplateRef } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'dc-promotions-table-filters-modal',
  templateUrl: './dc-promotion-table-filters-modal.component.html',
  styleUrls: ['./dc-promotion-table-filters-modal.component.css'],
  standalone: true
})
export class DcPromotionsFiltersTableModalComponent {
  private modalService = inject(NgbModal)
  @Input() title: string = ''
  closeResult = ''

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', centered: true })
  }
}
