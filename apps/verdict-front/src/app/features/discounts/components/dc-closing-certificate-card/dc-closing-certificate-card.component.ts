import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { DcFillClosingCertificateTemplateData } from '../../models/dc-closing-certificates';
import { NgFor, NgIf } from '@angular/common';
import { NgbDate, NgbModal, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DcClosingCertificatesService } from '../../services/dc-closing-certificates.service';
import { DatePickerPopupComponent } from 'apps/verdict-front/src/app/shared/components/date-picker-popup/date-picker-popup.component';
import { InputInGroupComponent } from 'apps/verdict-front/src/app/shared/components/input-in-group/input-in-group.component';
import { FormatAnyValuePipe } from 'apps/verdict-front/src/app/shared/pipes/format-any-value.pipe';
import { UtilFunctions } from 'apps/verdict-front/src/app/shared/utils/util.functions';
type TFields = 'RefNumber' | 'FirstCreditor' | 'ClientName';

@Component({
  selector: 'app-dc-closing-certificate-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    InputInGroupComponent,
    DatePickerPopupComponent,
    FormatAnyValuePipe,
    NgxExtendedPdfViewerModule,
  ],
  templateUrl: './dc-closing-certificate-card.component.html',
  styles: ``,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcClosingCertificateCardComponent {
  protected dcClosingCertificatesService = inject(DcClosingCertificatesService);

  readonly today = UtilFunctions.createNgbDateFromDate(new Date());

  @Input() cardTemplateData: DcFillClosingCertificateTemplateData[] = [];

  @Output() confirmTemplate = new EventEmitter<
    DcFillClosingCertificateTemplateData[]
  >();

  onDataChange(prom: DcFillClosingCertificateTemplateData) {
    const index = this.cardTemplateData.findIndex(
      (item) => item.CertificateRequestId === prom.CertificateRequestId
    );
    if (index !== -1) {
      this.cardTemplateData[index] = prom;
    } else {
      this.cardTemplateData.push(prom);
    }
    this.confirmTemplate.emit(this.cardTemplateData);
  }

  onFieldChange(
    prom: DcFillClosingCertificateTemplateData,
    field: TFields,
    value: string
  ) {
    switch (field) {
      case 'RefNumber':
        this.onDataChange({ ...prom, RefNumber: value });
        break;
      case 'FirstCreditor':
        this.onDataChange({ ...prom, FirstCreditor: value });
        break;
      case 'ClientName':
        this.onDataChange({ ...prom, ClientName: value });
        break;
    }
  }

  toNgbDate(refNumberDate: Date) {
    return UtilFunctions.createNgbDateFromDate(refNumberDate);
  }

  fromNgbDate(
    chosenDate: NgbDate | null,
    prom: DcFillClosingCertificateTemplateData
  ) {
    this.onDataChange({
      ...prom,
      RefNumberDate: UtilFunctions.ngbDateToDate(chosenDate) || new Date(),
    });
  }

  confirm() {
    this.confirmTemplate.emit(this.cardTemplateData);
  }
}
