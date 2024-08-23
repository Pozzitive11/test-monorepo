import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ContractPromotionsInfoModel } from '../../../models/contract-promotions-info.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'lr-contract-promotion-card',
  templateUrl: './lr-contract-promotion-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    DecimalPipe,
    FormatDatePipe
  ]
})
export class LrContractPromotionCardComponent {
  @Input() contractPromotion!: ContractPromotionsInfoModel
  @Output() selected = new EventEmitter<number>()

  selectContract() {
    this.selected.emit(this.contractPromotion.ClientPromotionId)
  }
}
