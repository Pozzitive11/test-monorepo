import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { IncomeInfoModel } from '../../../models/income-info.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { LrIncomeInfoByQuarterComponent } from '../lr-income-info-by-quarter/lr-income-info-by-quarter.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-income-info-card',
  templateUrl: './lr-income-info-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    LrIncomeInfoByQuarterComponent,
    FormatDatePipe
  ]
})
export class LrIncomeInfoCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN!: string
  @Input() contractId!: number

  get incomeInfo(): IncomeInfoModel | undefined {
    return this.dataService.guarantors[this.INN].IncomeInfo
  }

  get loading() { return this.dataService.loading.incomeInfo }

  ngOnInit(): void {
    this.dataService.getIncomeInfo(this.contractId, this.INN)
  }

  quarters() {
    if (!this.incomeInfo || !this.incomeInfo.IncomesByQuarter)
      return []
    return [...new Set(
      this.incomeInfo.IncomesByQuarter.map(quarter => `${quarter.Quarter}-${quarter.Year}`)
    )]
  }

  quarterInfo(quarterName: string) {
    if (!this.incomeInfo || !this.incomeInfo.IncomesByQuarter)
      return []

    return this.incomeInfo.IncomesByQuarter
      .filter(quarter => `${quarter.Quarter}-${quarter.Year}` === quarterName)
  }
}
