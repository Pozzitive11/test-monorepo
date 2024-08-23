import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { LrClientObjectsCardComponent } from '../../cards/lr-client-objects-card/lr-client-objects-card.component'
import { LrFinancialInfoCardComponent } from '../../cards/lr-financial-info-card/lr-financial-info-card.component'
import { LrCloseConditionsCardComponent } from '../../cards/lr-close-conditions-card/lr-close-conditions-card.component'
import {
  LrContractBasicInfoCardComponent
} from '../../cards/lr-contract-basic-info-card/lr-contract-basic-info-card.component'

@Component({
  selector: 'lr-tab-contract-info',
  templateUrl: './lr-tab-contract-info.component.html',
  standalone: true,
  imports: [
    LrContractBasicInfoCardComponent,
    LrCloseConditionsCardComponent,
    LrFinancialInfoCardComponent,
    LrClientObjectsCardComponent
  ]
})
export class LrTabContractInfoComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() contractId!: number
  @Input() promotionId: number | undefined

  ngOnInit(): void {
    this.dataService.getMortgagePropertyObjectsInfo(this.contractId)
  }

}
