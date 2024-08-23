import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { EpTotalInfoModel } from '../../../models/ep-total-info.model'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'

@Component({
  selector: 'lr-ep-total-info-card',
  templateUrl: './lr-ep-total-info-card.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar]
})
export class LrEpTotalInfoCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN!: string
  @Input() contractId!: number

  get epTotalInfo(): EpTotalInfoModel | undefined {
    return this.dataService.guarantors[this.INN].EpTotalInfo
  }

  get loading() { return this.dataService.loading.epTotalInfo }

  ngOnInit(): void {
    this.dataService.getEPTotalInfo(this.contractId, this.INN)
  }

}
