import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  input,
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { DcPathsOfDocSendingComponent } from '../dc-paths-of-doc-sending/dc-paths-of-doc-sending.component';
import { FormsModule } from '@angular/forms';
import { DcCreateClosingCertificateService } from '../../services/dc-create-closing-certificate.service';
import { FormatDatePipe } from 'apps/verdict-front/src/app/shared/pipes/format-date.pipe';

@Component({
  selector: 'app-dc-create-closing-certificate',
  standalone: true,
  imports: [
    CommonModule,
    FormatDatePipe,
    NgIf,
    NgbProgressbar,
    DcPathsOfDocSendingComponent,
    FormsModule,
  ],
  templateUrl: './dc-create-closing-certificate.component.html',
  styles: `
    .bg-red {
      background-color: #f1aeb5;
    }
    .bg-green {
      background-color: #d1e7dd;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DcCreateClosingCertificateComponent implements OnInit {
  protected dcCreateClosingCertificateService = inject(
    DcCreateClosingCertificateService
  );

  contractId = input('');
  constructor() {
    effect(() => {
      // console.log(this.dcCreateClosingCertificateService.docsFields())
      // console.log(this.dcCreateClosingCertificateService.isEmailSelected())
    });
  }
  ngOnInit(): void {
    this.dcCreateClosingCertificateService.getClosingCertificateInitialInfo(
      +this.contractId()
    );
    this.dcCreateClosingCertificateService.getSendingWays();
  }
}
