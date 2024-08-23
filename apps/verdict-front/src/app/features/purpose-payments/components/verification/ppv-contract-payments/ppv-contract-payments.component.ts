import { Component, inject, OnInit } from '@angular/core'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { dateFromString } from '../../../../../shared/utils/dates.util'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { ppVerificationTypes } from '../../../models/pp-verification.enum'
import { PpFiltersService } from '../../../services/pp-filters.service'
import { PpHttpClientService } from '../../../services/pp-http-client.service'
import { PpVerificationDataService } from '../../../services/pp-verification-data.service'
import {
  PivotTableSimpleComponent
} from '../../../../../shared/components/pivot-table/pivot-table-simple/pivot-table-simple.component'
import {
  DatePickerRangePopupComponent
} from '../../../../../shared/components/date-picker-range-popup/date-picker-range-popup.component'
import { SwitchCheckboxComponent } from '../../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'

@Component({
  selector: 'ppv-contract-payments',
  templateUrl: './ppv-contract-payments.component.html',
  styleUrls: ['./ppv-contract-payments.component.css'],
  standalone: true,
  imports: [NgIf, NgbProgressbar, SwitchCheckboxComponent, DatePickerRangePopupComponent, PivotTableSimpleComponent]
})
export class PpvContractPaymentsComponent implements OnInit {
  readonly verificationService = inject(PpVerificationDataService)
  readonly filterService = inject(PpFiltersService)
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)

  toggleIndex(colName: string, value: boolean) {
    if (value)
      this.verificationService.index.update(index => [...new Set([...index, colName])])
    else
      this.verificationService.index.update(index => index.filter(col => col !== colName))
  }

  ngOnInit() {
    this.filterService.loadGlobalFilters()
  }

  onViewSelected(rowName: string, verificationType: ppVerificationTypes) {
    const rowValues = rowName.split(this.verificationService.sep)
    const index = this.verificationService.index()
      .map((name, i) => ({ name, value: rowValues[i] }))
    console.log('rowValues, index', rowValues, index)

    let periods: Date[] | null = null
    let project: string | null = null
    let rNumber: number | null = null
    for (const { name, value } of index) {
      if (name === 'Період') {
        const period = dateFromString(value)
        periods = period ? [period] : null
      }
      if (name === 'Проєкт')
        project = value || null
      if (name === 'RNumber')
        rNumber = value ? +value : null
    }
    if (periods === null) {
      const uniquePeriods = [
        ...new Set(this.verificationService.contractPayments()
          .map(row => row.Period && dateFromString(row.Period)?.getTime())
          .filter(time => typeof time === 'number'))
      ] as number[]
      periods = uniquePeriods.map(time => new Date(time))
    }

    switch (verificationType) {
      case 'CONTRACT_PAYMENTS':
        this.loadSchedulePayDetails(periods, project, rNumber)
        break
      case 'PAYMENTS_PROCESSING':
        this.loadPaymentIdsFromContractPayments(periods, project, rNumber)
        break
    }

  }

  private loadSchedulePayDetails(periods: Date[], project: string | null, rNumber: number | null) {
    this.verificationService.loading.update(loading => ({ ...loading, contractPayments: true }))
    this.httpService.getSchedulePayDetails(periods, project, rNumber, this.verificationService.onlyFactoring())
      .subscribe({
        next: (res) => UtilFunctions.saveFileFromHttp(res, true),
        error: async error => {
          await this.messageService.alertFileError(error)
          this.verificationService.loading.update(loading => ({ ...loading, contractPayments: false }))
        },
        complete: () => this.verificationService.loading.update(loading => ({ ...loading, contractPayments: false }))
      })
  }

  private loadPaymentIdsFromContractPayments(periods: Date[], project: string | null, rNumber: number | null) {
    console.log(periods, project, rNumber, this.verificationService.onlyFactoring())
    this.verificationService.loading.update(loading => ({ ...loading, contractPayments: true }))
    this.verificationService.loadPayments(
      this.httpService.getPpPaymentIdsFromContractPayments(periods, project, rNumber, this.verificationService.onlyFactoring())
    )
  }
}
