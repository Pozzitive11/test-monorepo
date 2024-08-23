import { Component, Input } from '@angular/core'
import { IncomeDetailedInfoModel } from '../../../models/income-detailed-info.model'
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-income-stages-by-quarter',
  templateUrl: './lr-income-stages-by-quarter.component.html',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, CurrencyPipe]
})
export class LrIncomeStagesByQuarterComponent {
  @Input() incomeQuarterInfo: IncomeDetailedInfoModel[] = []

  incomeQuarterSum() {
    return this.incomeQuarterInfo
      .reduce((sum, { SumEarned }) => sum + (SumEarned || 0), 0)
  }

  get incomeQuarter() {
    return this.incomeQuarterInfo[0]?.Period
  }

}
