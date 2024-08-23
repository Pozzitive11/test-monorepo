import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { DcSearchClosingCertificateComponent } from '../../components/dc-search-closing-certificate/dc-search-closing-certificate.component'
import { DcClosingCertificateTemplateViewComponent } from '../../components/dc-closing-certificate-template-view/dc-closing-certificate-template-view.component'

@Component({
  selector: 'app-dc-closing-certificates-page',
  standalone: true,
  imports: [DcSearchClosingCertificateComponent, DcClosingCertificateTemplateViewComponent],
  templateUrl: './dc-closing-certificates-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcClosingCertificatesPageComponent {}
