import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { DcCreateClosingCertificateComponent } from '../../components/dc-create-closing-certificate/dc-create-closing-certificate.component';
import { DcDataService } from '../../services/dc-data.service';
import { LrContractPromotionCardComponent } from '../../../long-requests/components/cards/lr-contract-promotion-card/lr-contract-promotion-card.component';
import { LrDataService } from '../../../long-requests/services/lr-data.service';

@Component({
  selector: 'app-dc-nks-requests',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    FormsModule,
    NgFor,
    LrContractPromotionCardComponent,
    CommonModule,
    DcCreateClosingCertificateComponent,
  ],
  templateUrl: './dc-nks-requests.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DcNksRequestsComponent {
  private readonly router = inject(Router);
  protected readonly lrDataService = inject(LrDataService);
  protected readonly dcDataService = inject(DcDataService);
  private modalService = inject(NgbModal);
  contractId = signal('');
  cardType = signal('');

  openModal(content: TemplateRef<any>, cardType: string) {
    this.cardType.set(cardType);
    if (cardType === 'longReq') {
      this.lrDataService.getContractPromotions(this.contractId());
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  selectPromotion(promotionId: number) {
    this.lrDataService.selectedContractId = +this.contractId();
    this.router.navigate([
      'discounts',
      'long_requests',
      'promotion',
      promotionId,
    ]);
    this.modalService.dismissAll();
  }

  createPromotion() {
    this.lrDataService.selectedContractId = +this.contractId();
    this.router.navigate([
      'discounts',
      'long_requests',
      'create_promotion',
      this.contractId(),
    ]);
    this.modalService.dismissAll();
  }

  createDsRs() {
    this.lrDataService.selectedContractId = +this.contractId();
    this.router.navigate(['/discounts/info'], {
      queryParams: {
        contractId: this.contractId(),
      },
    });
  }
  requestForDocuments() {
    this.dcDataService.contractId = this.contractId();
    this.dcDataService.documentRequest();
  }
}
