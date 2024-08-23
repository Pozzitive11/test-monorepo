import { Component, Input } from '@angular/core'
import { PropertyInventoryModel } from '../../../models/property-inventory.model'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { CurrencyPipe, NgIf } from '@angular/common'

@Component({
  selector: 'lr-inventory-auction-card',
  templateUrl: './lr-inventory-auction-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    FormatDatePipe
  ]
})
export class LrInventoryAuctionCardComponent {
  @Input() property!: PropertyInventoryModel

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }

  isAuctionScheduled() {
    return (
      this.property.NoScheduledAuctionDays != undefined
      && this.property.AuctionStageIsPositive
      && this.property.AuctionStageIsPositive < 2
      && !this.property.AuctionStatusStop
    )
  }
}
