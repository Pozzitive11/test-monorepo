import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { BasicLongRequestInfoModel } from '../../models/basic-long-request-info.model'
import { guarantorInfoFilled, GuarantorInfoModel } from '../../models/guarantor-info.model'
import { LrDataService } from '../../services/lr-data.service'
import { LrHttpService } from '../../services/lr-http.service'
import { LrTabEpInfoComponent } from '../../components/tabs/lr-tab-ep-info/lr-tab-ep-info.component'
import {
  LrTabGuarantorDataComponent
} from '../../components/tabs/lr-tab-guarantor-data/lr-tab-guarantor-data.component'
import { LrTabContractInfoComponent } from '../../components/tabs/lr-tab-contract-info/lr-tab-contract-info.component'
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
  NgbProgressbar,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-info-page',
  templateUrl: './lr-info-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    LrTabContractInfoComponent,
    NgFor,
    LrTabGuarantorDataComponent,
    LrTabEpInfoComponent,
    NgbNavOutlet,
    NgbTooltip
  ]
})
export class LrInfoPageComponent implements OnInit {
  private readonly httpService = inject(LrHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly route = inject(ActivatedRoute)
  readonly dataService = inject(LrDataService)

  loading: boolean = false
  contractId?: number
  promotionId?: number
  addToDB: boolean = true

  get debtors() {
    return this.dataService.contractBasicInfo.Debtors
  }

  get guarantors() {
    return this.dataService.contractBasicInfo.Guarantors
  }

  get everythingLoaded() {
    return this.dataService.everythingLoaded
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params
    this.contractId = params['contractId']
    if (!this.contractId)
      this.contractId = this.dataService.selectedContractId
    this.promotionId = params['promotionId']

    if (!this.contractId && this.promotionId) {
      this.httpService.getContractFromPromId(this.promotionId)
        .subscribe({
          next: contractId => this.contractId = contractId,
          error: async err => await this.messageService.alertError(err)
        })
    }

    this.dataService.getRiskGroups()
    this.dataService.getMoratoriumReasons()
  }

  requiredDataFilled(): boolean {
    if (!this.dataService.everythingLoaded)
      return false

    // Перевірка на заповнення LTV для іпотеки/застави
    if (this.dataService.mortgageObjectsInfo.property) {
      for (let prop of this.dataService.mortgageObjectsInfo.property) {
        if (prop.CostValuationPerUnit === 0)
          continue

        if (!prop.CostValuationPerUnit)
          return false

        if (!prop.LTV || prop.LTV < 200 && !prop.LTVArgumentation)
          return false
      }
    }
    if (this.dataService.mortgageObjectsInfo.auto) {
      for (let car of this.dataService.mortgageObjectsInfo.auto) {
        if (car.CostValuation === 0)
          continue

        if (!car.CostValuation)
          return false

        if (!car.LTV || car.LTV < 200 && !car.LTVArgumentation)
          return false
      }
    }

    const guarantorsInfoFilled = this.guarantors.map(
      guarantor => this.dataService.guarantors[guarantor.INN || '']
    ).every(guarantor => guarantorInfoFilled(guarantor))

    return (
      !!this.contractId &&
      guarantorsInfoFilled &&
      this.dataService.epDetailedInfo !== undefined &&
      this.dataService.propertyInventoryInfo !== undefined &&
      this.dataService.incomeStagesInfo !== undefined &&
      this.dataService.arrestStagesInfo !== undefined &&
      this.dataService.mvsStagesInfo !== undefined &&
      this.dataService.othersEPInfo !== undefined &&
      !!this.dataService.financialInfo &&
      (
        !!this.dataService.financialInfo.CurrencyExchangeRateCommercial ||
        this.dataService.financialInfo.CurrencyExchangeRate == 1
      )
    )
  }

  createExcelFromData() {
    if (!this.requiredDataFilled())
      return this.messageService.sendError(
        'Не всі необхідні дані внесені. Перевірте незаповнені поля і спробуйте ще раз.'
      )

    let guarantorsInfo: GuarantorInfoModel[] = []

    this.dataService.contractBasicInfo.Debtors.forEach(
      debtor => guarantorsInfo.push(
        { ...this.dataService.guarantors[debtor.INN || ''], Guarantor: debtor }
      )
    )

    this.dataService.contractBasicInfo.Guarantors.forEach(
      guarantor => guarantorsInfo.push(
        { ...this.dataService.guarantors[guarantor.INN || ''], Guarantor: guarantor }
      )
    )

    const dataToSend: BasicLongRequestInfoModel = {
      CloseConditions: this.dataService.closeConditions,
      ContractBasicInfo: this.dataService.contractBasicInfo,
      ContractId: this.contractId!,
      FinancialInfo: this.dataService.financialInfo!,
      MortgageClientObjects: this.dataService.mortgageObjectsInfo,
      PromotionId: this.promotionId,
      GuarantorsInfo: guarantorsInfo,
      EPDetailedInfo: this.dataService.epDetailedInfo,
      EPDetailedInfoRelated: this.dataService.epDetailedInfoRelated,
      IncomeStages: this.dataService.incomeStagesInfo,
      ArrestStages: this.dataService.arrestStagesInfo,
      MVSStages: this.dataService.mvsStagesInfo,
      PropertyInventory: this.dataService.propertyInventoryInfo,
      OthersEPInfo: this.dataService.othersEPInfo
    }

    this.loading = true
    this.httpService.createExcelFromData(dataToSend, this.addToDB)
      .subscribe({
        next: (file) => UtilFunctions.downloadXlsx(file, `${this.contractId}`, 'dmYHMS'),
        error: async error => {
          await this.messageService.alertFileError(error)
          this.loading = false
        },
        complete: () => this.loading = false
      })

  }
}
