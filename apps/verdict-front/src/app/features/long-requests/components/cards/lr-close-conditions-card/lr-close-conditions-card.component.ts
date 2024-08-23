import { Component, inject, Input, OnInit } from '@angular/core'
import { CloseConditionsModel } from '../../../models/close-conditions.model'
import { LrDataService } from '../../../services/lr-data.service'
import { NgbModal, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { LrCloseConditionsEditComponent } from '../../edits/lr-close-conditions-edit/lr-close-conditions-edit.component'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'lr-close-conditions-card',
  templateUrl: './lr-close-conditions-card.component.html',
  standalone: true,
  imports: [
    NgbTooltip,
    NgIf,
    NgbProgressbar,
    DecimalPipe,
    CurrencyPipe,
    FormatDatePipe
  ]
})
export class LrCloseConditionsCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)
  private readonly modalService = inject(NgbModal)

  @Input() promotionId?: number
  @Input() contractId?: number

  get closeConditions(): CloseConditionsModel {
    return this.dataService.closeConditions
  }

  get loading() {
    return this.dataService.loading.closeConditions
  }

  ngOnInit(): void {
    this.dataService.getCloseConditions(this.promotionId, this.contractId)
  }

  openEdit() {
    const modalRef = this.modalService.open(
      LrCloseConditionsEditComponent,
      {
        centered: true,
        scrollable: true,
        size: '500px'
      }
    )
    modalRef.componentInstance.closeConditions = { ...this.closeConditions }
    modalRef.componentInstance.contractId = this.contractId
    modalRef.result
      .then(closeConditions => this.dataService.closeConditions = closeConditions)
      .catch(() => {})
  }

}
