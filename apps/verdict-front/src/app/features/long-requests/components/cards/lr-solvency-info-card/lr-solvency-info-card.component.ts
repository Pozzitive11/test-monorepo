import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { IncomeInfoModel } from '../../../models/income-info.model'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { LrSolvencyInfoByQuarterComponent } from '../lr-solvency-info-by-quarter/lr-solvency-info-by-quarter.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-solvency-info-card',
  templateUrl: './lr-solvency-info-card.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgFor,
    LrSolvencyInfoByQuarterComponent,
    FormatDatePipe
  ]
})
export class LrSolvencyInfoCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN!: string
  @Input() contractId!: number

  get incomeInfo(): IncomeInfoModel | undefined {
    return this.dataService.guarantors[this.INN].IncomeInfo
  }

  get loading() {
    return this.dataService.loading.incomeInfo
  }

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
