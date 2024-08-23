import { Component, Input } from '@angular/core'
import { PropertyInventoryModel } from '../../../../models/property-inventory.model'
import { UtilFunctions } from '../../../../../../shared/utils/util.functions'
import { CarInfoFlowModel } from '../../../../models/car-info-flow.model'
import { FormatDatePipe } from '../../../../../../shared/pipes/format-date.pipe'
import { LrInventoryAuctionCardComponent } from '../../lr-inventory-auction-card/lr-inventory-auction-card.component'
import { NgIf } from '@angular/common'

@Component({
  selector: 'lr-car-sub-card',
  templateUrl: './lr-car-sub-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    LrInventoryAuctionCardComponent,
    FormatDatePipe
  ]
})
export class LrCarSubCardComponent {
  @Input() carObj?: CarInfoFlowModel
  @Input() inventoryObject?: PropertyInventoryModel
  shortDescription: boolean = true

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }

}
