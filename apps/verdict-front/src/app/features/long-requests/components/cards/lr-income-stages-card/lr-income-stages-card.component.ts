import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { IncomeStagesModel } from '../../../models/income-stages.model'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { LrIncomeStagesByQuarterComponent } from '../lr-income-stages-by-quarter/lr-income-stages-by-quarter.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-income-stages-card',
  templateUrl: './lr-income-stages-card.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, NgFor, LrIncomeStagesByQuarterComponent, FormatDatePipe]
})
export class LrIncomeStagesCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)

  @Input() INN?: string
  @Input() contractId!: number

  get incomeStagesInfo(): IncomeStagesModel[] | undefined { return this.dataService.incomeStagesInfo }

  get loading() { return this.dataService.loading.incomeStagesInfo }

  ngOnInit(): void {
    this.dataService.getIncomeStagesInfo(this.contractId, this.INN)
  }

  daysToString(days: number) {
    return UtilFunctions.daysToString(days)
  }

  getSum(IncomeDetailedInfo: { SumEarned?: number }[]) {
    return IncomeDetailedInfo.reduce((sum, { SumEarned }) => sum + (SumEarned || 0), 0)
  }
}
