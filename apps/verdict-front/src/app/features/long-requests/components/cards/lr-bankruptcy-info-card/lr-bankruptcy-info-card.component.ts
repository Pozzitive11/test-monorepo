import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { BankruptcyInfoModel } from '../../../models/bankruptcy-info.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-bankruptcy-info-card',
  templateUrl: './lr-bankruptcy-info-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    FormatDatePipe
  ]
})
export class LrBankruptcyInfoCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN!: string
  @Input() contractId!: number

  get bankruptcyInfo(): BankruptcyInfoModel | undefined {
    return this.dataService.guarantors[this.INN].BankruptcyInfo
  }

  get loading() { return this.dataService.loading.bankruptcyInfo }

  ngOnInit(): void {
    this.dataService.getBankruptcyInfo(this.contractId, this.INN)
  }

}
