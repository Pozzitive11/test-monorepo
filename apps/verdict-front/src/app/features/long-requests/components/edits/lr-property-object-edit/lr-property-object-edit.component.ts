import { Component, inject, Input, OnInit } from '@angular/core'
import { PropertyObjectModel } from '../../../models/property-object.model'
import { NgbActiveModal, NgbDate, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { RiskGroupsModel } from '../../../models/risk-groups.model'
import { DictionaryModel } from '../../../../../shared/models/dictionary.model'
import { LrDataService } from '../../../services/lr-data.service'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { FormsModule } from '@angular/forms'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'
import {
  DatePickerPopupComponent
} from '../../../../../shared/components/date-picker-popup/date-picker-popup.component'
import { SumInputComponent } from '../../../../../shared/components/sum-input/sum-input.component'
import { DecimalPipe, NgIf } from '@angular/common'

@Component({
  selector: 'lr-property-object-edit',
  templateUrl: './lr-property-object-edit.component.html',
  standalone: true,
  imports: [
    NgIf,
    SumInputComponent,
    DatePickerPopupComponent,
    DefaultDropdownComponent,
    NgbTooltip,
    FormsModule,
    DecimalPipe
  ]
})
export class LrPropertyObjectEditComponent implements OnInit {
  readonly activeModal = inject(NgbActiveModal)
  private readonly dataService = inject(LrDataService)

  @Input() propertyObject!: PropertyObjectModel
  @Input() isMortgage!: boolean
  @Input() riskGroups!: RiskGroupsModel[]
  @Input() moratoriumReasons: DictionaryModel[] = []

  selectedGroup?: string
  selectedProblem?: string
  areaPredefined: boolean = false

  get groups() {
    return this.riskGroups.map(rg => rg.RiskGroup)
  }

  get contractDebt() {
    if (this.dataService.financialInfo)
      return this.dataService.financialInfo.Debt * this.exchangeRate

    return undefined
  }

  get exchangeRate() {
    if (!this.dataService.financialInfo)
      return 1

    const financialInfo = this.dataService.financialInfo
    return financialInfo.CurrencyExchangeRateCommercial ?
      financialInfo.CurrencyExchangeRateCommercial :
      financialInfo.CurrencyExchangeRate
  }

  get valuationDate() {
    return UtilFunctions.createNgbDate(this.propertyObject.DateOfValuation || null)
  }

  set valuationDate(date) {
    this.propertyObject.DateOfValuation = date ? UtilFunctions.ngbDateStructToStringDate(date) : undefined
  }

  ngOnInit(): void {
    if (this.propertyObject.RiskGroup) {
      this.selectedGroup = this.propertyObject.RiskGroup[0]
      this.selectedProblem = (this.propertyObject.RiskGroup.match(/(?<=\().+(?=\))/g) || [''])[0]
    }
    this.areaPredefined = !!this.propertyObject.CollateralArea
  }

  problems(group: string) {
    const allProblems = this.riskGroups.filter(rg => rg.RiskGroup === group)
    if (allProblems)
      return allProblems[0].ProblemNames

    return []
  }

  updateCostValuation() {
    if (this.propertyObject.CostValuationPerUnit && this.propertyObject.CollateralArea)
      this.propertyObject.CostValuation = this.propertyObject.CostValuationPerUnit * this.propertyObject.CollateralArea
  }

  updateLTV() {
    this.updateCostValuation()
    if (this.contractDebt && this.propertyObject.CostValuation)
      this.propertyObject.LTV = (
        this.contractDebt / (this.propertyObject.CostValuation * this.exchangeRate) * 100
      )
  }

  setRiskGroup(selectedProblem: string) {
    this.propertyObject.RiskGroup = `${this.selectedGroup} (${selectedProblem})`
  }

  moratoriumReasonsStrings() {
    return this.moratoriumReasons.map(reason => reason.name)
  }

  updateValuationDate(date: NgbDate | null) {
    this.valuationDate = date
  }
}
