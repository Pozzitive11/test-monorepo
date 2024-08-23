import { Component, Input } from '@angular/core'
import { LrOthersEpCardComponent } from '../../cards/lr-others-ep-card/lr-others-ep-card.component'
import { LrInventoryCardComponent } from '../../cards/lr-inventory-card/lr-inventory-card.component'
import { LrMvsStagesCardComponent } from '../../cards/lr-mvs-stages-card/lr-mvs-stages-card.component'
import { LrArrestStagesCardComponent } from '../../cards/lr-arrest-stages-card/lr-arrest-stages-card.component'
import { LrIncomeStagesCardComponent } from '../../cards/lr-income-stages-card/lr-income-stages-card.component'
import { LrEpDetailedInfoCardComponent } from '../../cards/lr-ep-detailed-info-card/lr-ep-detailed-info-card.component'

@Component({
  selector: 'lr-tab-ep-info',
  templateUrl: './lr-tab-ep-info.component.html',
  standalone: true,
  imports: [
    LrEpDetailedInfoCardComponent,
    LrIncomeStagesCardComponent,
    LrArrestStagesCardComponent,
    LrMvsStagesCardComponent,
    LrInventoryCardComponent,
    LrOthersEpCardComponent
  ]
})
export class LrTabEpInfoComponent {
  @Input() contractId!: number
  @Input() promotionId: number | undefined
}
