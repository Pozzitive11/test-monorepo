import { Component, inject } from '@angular/core'
import { PpVerificationDataService } from '../../services/pp-verification-data.service'
import { PpvPaymentDocsComponent } from '../../components/verification/ppv-payment-docs/ppv-payment-docs.component'
import {
  PpvContractPaymentsComponent
} from '../../components/verification/ppv-contract-payments/ppv-contract-payments.component'
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLinkBase,
  NgbNavLinkButton,
  NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'pp-verification-page',
  templateUrl: './pp-verification-page.component.html',
  standalone: true,
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLinkButton,
    NgbNavLinkBase,
    NgbNavContent,
    PpvContractPaymentsComponent,
    PpvPaymentDocsComponent,
    NgbNavOutlet
  ]
})
export class PpVerificationPageComponent {
  readonly verificationService = inject(PpVerificationDataService)
}
