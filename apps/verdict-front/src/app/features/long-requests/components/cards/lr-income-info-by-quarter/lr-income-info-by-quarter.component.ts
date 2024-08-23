import { Component, Input } from '@angular/core'
import { IncomeQuarterModel } from '../../../models/income-info.model'
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-income-info-by-quarter',
  templateUrl: './lr-income-info-by-quarter.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DecimalPipe,
    CurrencyPipe
  ]
})
export class LrIncomeInfoByQuarterComponent {
  @Input() incomeQuarterInfo: IncomeQuarterModel[] = []
  @Input() incomeQuarter: string = ''

  incomeTotalSum() {
    return this.incomeQuarterInfo
      .map(quarter => quarter.IncomeSum)
      .reduce((prev, cur) => prev + cur, 0)
  }

}
