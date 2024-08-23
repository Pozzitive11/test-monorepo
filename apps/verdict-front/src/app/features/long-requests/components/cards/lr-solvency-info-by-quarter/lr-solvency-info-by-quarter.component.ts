import { Component, Input } from '@angular/core'
import { IncomeQuarterModel } from '../../../models/income-info.model'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-solvency-info-by-quarter',
  templateUrl: './lr-solvency-info-by-quarter.component.html',
  standalone: true,
  imports: [NgIf, NgFor]
})
export class LrSolvencyInfoByQuarterComponent {
  @Input() incomeQuarterInfo: IncomeQuarterModel[] = []
  @Input() incomeQuarter: string = ''

  incomeTotalSum() {
    return this.incomeQuarterInfo
      .map(quarter => quarter.Bucket)
      .reduce((prev, cur) => prev + cur, 0)
  }
}
