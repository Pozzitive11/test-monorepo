import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DcClosingCertificatesService } from '../../services/dc-closing-certificates.service';
import { FormsModule } from '@angular/forms';
import { DatePickerRangePopupComponent } from 'apps/verdict-front/src/app/shared/components/date-picker-range-popup/date-picker-range-popup.component';

@Component({
  selector: 'app-dc-search-closing-certificate',
  standalone: true,
  imports: [DatePickerRangePopupComponent, FormsModule],
  templateUrl: './dc-search-closing-certificate.component.html',
  styles: ``,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcSearchClosingCertificateComponent {
  protected dcClosingCertificatesService = inject(DcClosingCertificatesService);
}
