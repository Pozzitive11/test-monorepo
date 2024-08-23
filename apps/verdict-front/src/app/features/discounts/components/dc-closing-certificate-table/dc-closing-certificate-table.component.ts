import { Component, inject } from '@angular/core';
import { DcClosingCertificatesService } from '../../services/dc-closing-certificates.service';
import { CommonModule, NgIf } from '@angular/common';
import { DcClosingCertificateCardComponent } from '../dc-closing-certificate-card/dc-closing-certificate-card.component';
import { DcClosingCertificatePdfViewComponent } from '../dc-closing-certificate-pdf-view/dc-closing-certificate-pdf-view.component';
import { TableWithSortComponent } from 'apps/verdict-front/src/app/shared/components/table-with-sort/table-with-sort.component';

@Component({
  selector: 'app-dc-closing-certificate-table',
  standalone: true,
  imports: [
    TableWithSortComponent,
    NgIf,
    DcClosingCertificateCardComponent,
    CommonModule,
    DcClosingCertificatePdfViewComponent,
  ],
  templateUrl: './dc-closing-certificate-table.component.html',
  styles: ``,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcClosingCertificateTableComponent {
  protected dcClosingCertificatesService = inject(DcClosingCertificatesService);

  dateTableHeaders = ['RequestDate', 'EntryDate', 'PaymentDateLimit'];
  priceTableHeaders = [
    'Debt',
    'DebtOnPurchase',
    'TotalPaymentSum',
    'OverPayment',
    'SumToPay',
    'DiscountPercent',
  ];

  handleSelectedCheckboxRows(selectedRows: number[]) {
    this.dcClosingCertificatesService.checkedRows.set(selectedRows);
  }
}
