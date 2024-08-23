import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { ClientInfoModel } from '../../../models/client-info.model'
import { LrBankruptcyInfoCardComponent } from '../../cards/lr-bankruptcy-info-card/lr-bankruptcy-info-card.component'
import { LrEpTotalInfoCardComponent } from '../../cards/lr-ep-total-info-card/lr-ep-total-info-card.component'
import { LrSolvencyInfoCardComponent } from '../../cards/lr-solvency-info-card/lr-solvency-info-card.component'
import { LrMegasolvencyCardComponent } from '../../cards/lr-megasolvency-card/lr-megasolvency-card.component'
import { LrClientObjectsCardComponent } from '../../cards/lr-client-objects-card/lr-client-objects-card.component'

@Component({
  selector: 'lr-tab-guarantor-data',
  templateUrl: './lr-tab-guarantor-data.component.html',
  standalone: true,
  imports: [
    LrClientObjectsCardComponent,
    LrMegasolvencyCardComponent,
    LrSolvencyInfoCardComponent,
    LrEpTotalInfoCardComponent,
    LrBankruptcyInfoCardComponent
  ]
})
export class LrTabGuarantorDataComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() guarantor!: ClientInfoModel
  @Input() contractId!: number

  get INN() {
    return this.guarantor.INN || ''
  }

  ngOnInit(): void {
    this.dataService.guarantors[this.INN] = { AdditionalObjectsInfo: {} }
    this.dataService.getAdditionalPropertyObjectsInfo(this.contractId, this.INN)
  }

}
