import { Component, inject } from '@angular/core'
import { PpPaymentDocsVerificationTypes } from '../../../models/pp-payment-docs-verification-types.enum'
import { PpHttpClientService } from '../../../services/pp-http-client.service'
import { PpVerificationDataService } from '../../../services/pp-verification-data.service'
import { PpvDocsCardComponent } from '../../../ui/verification/ppv-docs-card/ppv-docs-card.component'
import { SearchableListComponent } from '../../../../../shared/components/searchable-list/searchable-list.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'

@Component({
  selector: 'ppv-payment-docs',
  templateUrl: './ppv-payment-docs.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    SearchableListComponent,
    PpvDocsCardComponent
  ]
})
export class PpvPaymentDocsComponent {
  readonly verificationService = inject(PpVerificationDataService)
  private readonly httpService = inject(PpHttpClientService)

  loadUnverifiedPayments(period: string | null, type: PpPaymentDocsVerificationTypes | null) {
    this.verificationService.loading.update(loading => ({ ...loading, processingPayments: true }))

    this.verificationService.loadPayments(
      this.httpService.getPaymentIdsFromDocsVerification(
        period,
        period === null ? this.verificationService.paymentDocsVerificationSelectedPeriodsDates() : [],
        type
      )
    )

  }

}
