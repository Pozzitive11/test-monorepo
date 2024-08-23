import { Component, EventEmitter, Input, Output } from '@angular/core'
import { InflationModel, InflationReqModel } from '../../../models/inflation.model'
import { NgbDate, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { DecisionSum } from '../../../models/decision-sum.model'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'
import { SumInputComponent } from '../../../../../shared/components/sum-input/sum-input.component'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'


@Component({
  selector: 'lr-inflation-edit',
  templateUrl: './lr-inflation-edit.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, DatePickerPopupComponent, NgFor, SumInputComponent, DefaultDropdownComponent, NgbTooltip, CurrencyPipe]
})
export class LrInflationEditComponent {
  @Input() inflation!: InflationModel
  @Input() contractId!: number
  @Input() currencies: string[] = ['UAH']
  @Input() currencyValue: number = 1
  @Input() loading: boolean = false
  @Input() minAccruedSumForClaim: number = 50000
  @Output() inflationChange = new EventEmitter<InflationReqModel>()

  readonly minDecisionDate: NgbDate = new NgbDate(2000, 1, 1)
  readonly maxDecisionDate: NgbDate | null = UtilFunctions.createNgbDate(new Date(Date.now()))


  inflationReq!: InflationReqModel

  get accruedSum(): number {
    return this.inflation.InflationSum + this.inflation.ThreePercentSum
  }

  get decisionSum(): number {
    return this.inflation.DecisionSums
      .reduce((prev, cur) => prev + cur.Sum * cur.CurrencyValue, 0)
  }

  get decisionDate(): NgbDate | null {
    return UtilFunctions.createNgbDate(this.inflation.DecisionDate)
  }

  set decisionDate(value) {
    this.inflation.DecisionDate = UtilFunctions.ngbDateToDate(value)

    this.calculateAccruedSum()
  }

  addDecisionSum() {
    this.inflation.DecisionSums.push({ Sum: 0, CurrencyValue: 1, Currency: 'UAH' })
  }

  removeDecisionSum(index: number) {
    this.inflation.DecisionSums = this.inflation.DecisionSums
      .filter((decision, ind) => ind !== index)
    this.calculateAccruedSum()
  }

  calculateAccruedSum() {
    if (!this.inflation.DecisionDate || this.decisionSum === 0)
      return

    this.inflation.IsCurrencyPresent = this.inflation.DecisionSums
      .map(ds => ds.CurrencyValue)
      .some(cv => cv !== 1)

    const threeYearsAgo = new Date(Date.now())
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

    const startDate: Date = (
      this.inflation.DecisionDate.valueOf() > threeYearsAgo.valueOf() ?
        this.inflation.DecisionDate : threeYearsAgo
    )
    const endDate: Date = new Date('2022-02-24')

    this.inflationReq = {
      ...this.inflation,
      ContractId: this.contractId,
      StartDate: startDate,
      EndDate: endDate
    }

    this.inflationChange.emit(this.inflationReq)
  }

  changeCurrency(decision: DecisionSum, currency: string | 'UAH') {
    decision.Currency = currency

    if (currency == 'UAH')
      decision.CurrencyValue = 1
    else
      decision.CurrencyValue = this.currencyValue

    this.calculateAccruedSum()
  }
}
