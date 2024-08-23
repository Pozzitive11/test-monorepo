import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { ContractBasicInfoModel } from '../../../models/contract-basic-info.model'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-contract-basic-info-card',
  templateUrl: './lr-contract-basic-info-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor
  ]
})
export class LrContractBasicInfoCardComponent implements OnInit {
  readonly dataService = inject(LrDataService)

  @Input() contractId!: number

  get contractBasicInfo(): ContractBasicInfoModel {
    return this.dataService.contractBasicInfo
  }

  get loading() {
    return this.dataService.loading.contractBasicInfo
  }

  ngOnInit(): void {
    this.dataService.getContractBasicInfo(this.contractId)
  }

}
