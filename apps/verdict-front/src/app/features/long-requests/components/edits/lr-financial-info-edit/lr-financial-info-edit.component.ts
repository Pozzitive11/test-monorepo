import { Component, inject, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FinancialInfoModel } from '../../../models/financial-info.model'
import { InflationReqModel } from '../../../models/inflation.model'
import { LrHttpService } from '../../../services/lr-http.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { LrInflationEditComponent } from '../lr-inflation-edit/lr-inflation-edit.component'
import { NgIf } from '@angular/common'
import { SumInputComponent } from '../../../../../shared/components/sum-input/sum-input.component'

@Component({
  selector: 'financial-info-edit',
  templateUrl: './lr-financial-info-edit.component.html',
  standalone: true,
  imports: [
    SumInputComponent,
    NgIf,
    LrInflationEditComponent
  ]
})
export class LrFinancialInfoEditComponent {
  readonly activeModal = inject(NgbActiveModal)
  private readonly httpService = inject(LrHttpService)
  private readonly messageService = inject(MessageHandlingService)

  @Input() contractId!: number
  @Input() financialInfo!: FinancialInfoModel
  @Input() minAccruedSumForClaim: number = 50000
  @Input() inflationInfoEnabled: boolean = false

  loading: boolean = false

  get currenciesForAccruedSum(): string[] {
    return [...new Set(['UAH', this.financialInfo.ContractCurrency])]
  }

  finishCalculatingAccrualSum() {
    this.financialInfo.Inflation.IsPossible = (
      this.financialInfo.Inflation.InflationSum + this.financialInfo.Inflation.ThreePercentSum >
      this.minAccruedSumForClaim
    )
    this.loading = false
  }

  calculateAccrualSum(inflation: InflationReqModel) {
    this.financialInfo.Inflation = inflation
    if (inflation.DecisionSums.reduce((prev, cur) => prev + cur.Sum * cur.CurrencyValue, 0) === 0)
      return

    this.loading = true
    let loadings = 2

    const inflationSum = this.httpService.calculateAccruedSum(inflation, 'inflation')
    const threePercentSum = this.httpService.calculateAccruedSum(inflation, 'three_percent')

    this.financialInfo.Inflation.InflationSum = 0
    this.financialInfo.Inflation.ThreePercentSum = 0

    inflationSum.subscribe({
      next: (sum) => this.financialInfo.Inflation.InflationSum += sum,
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.loading = false
      },
      complete: () => {
        loadings--
        if (loadings === 0)
          this.finishCalculatingAccrualSum()
      }
    })

    threePercentSum.subscribe({
      next: (sum) => this.financialInfo.Inflation.ThreePercentSum += sum,
      error: err => {
        this.messageService.sendError(err.error.detail)
        this.loading = false
      },
      complete: () => {
        loadings--
        if (loadings === 0)
          this.finishCalculatingAccrualSum()
      }
    })

  }
}
