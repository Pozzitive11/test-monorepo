import { Component, inject, Input, OnInit } from '@angular/core'
import { LrDataService } from '../../../services/lr-data.service'
import { FinancialInfoModel } from '../../../models/financial-info.model'
import { LrFinancialInfoEditComponent } from '../../edits/lr-financial-info-edit/lr-financial-info-edit.component'
import { NgbModal, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe'
import { SwitchCheckboxComponent } from '../../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'lr-financial-info-card',
  templateUrl: './lr-financial-info-card.component.html',
  standalone: true,
  imports: [NgbTooltip, NgIf, NgbProgressbar, SwitchCheckboxComponent, NgFor, DecimalPipe, CurrencyPipe, FormatDatePipe]
})
export class LrFinancialInfoCardComponent implements OnInit {
  private readonly dataService = inject(LrDataService)
  private readonly modalService = inject(NgbModal)

  readonly minAccruedSumForClaim = 50000

  @Input() contractId!: number

  inflationInfoEnabled: boolean = false

  get financialInfo(): FinancialInfoModel | undefined { return this.dataService.financialInfo }

  get loading() { return this.dataService.loading.financialInfo }

  ngOnInit(): void {
    this.dataService.getFinancialInfo(this.contractId)
  }

  editFinancialInfo(inflation: boolean = false) {
    if (!this.financialInfo)
      return

    const modalRef = this.modalService.open(
      LrFinancialInfoEditComponent,
      {
        centered: true,
        scrollable: true,
        size: 'md'
      }
    )
    modalRef.componentInstance.financialInfo = {
      ...this.financialInfo,
      Inflation: {
        ...this.financialInfo.Inflation,
        DecisionSums: this.financialInfo.Inflation.DecisionSums.map((sum) => ({ ...sum }))
      }
    }
    modalRef.componentInstance.contractId = this.contractId
    modalRef.componentInstance.minAccruedSumForClaim = this.minAccruedSumForClaim
    modalRef.componentInstance.inflationInfoEnabled = this.inflationInfoEnabled
    modalRef.result
      .then(financialInfo => this.dataService.financialInfo = financialInfo)
      .catch(() => inflation ? this.inflationInfoEnabled = false : null)
  }
}
