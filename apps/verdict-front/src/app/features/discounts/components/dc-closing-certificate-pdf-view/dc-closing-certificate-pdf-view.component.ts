import { ChangeDetectionStrategy, Component, Output, effect, inject, output, signal } from '@angular/core'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import { DcClosingCertificatesService } from '../../services/dc-closing-certificates.service'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'
import { DcFillClosingCertificateTemplateData } from '../../models/dc-closing-certificates'
import { CommonModule, NgFor, NgIf } from '@angular/common'
import { DcHttpService } from '../../services/dc-http.service'

@Component({
  selector: 'app-dc-closing-certificate-pdf-view',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, NgbAccordionModule, CommonModule, NgIf, NgFor],
  templateUrl: './dc-closing-certificate-pdf-view.component.html',
  styles: `
    .accordion-button::after,
    .accordion-button-confirmed {
      display: none;
    }
    .confirmed {
      background-color: #d4edda;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcClosingCertificatePdfViewComponent {
  protected dcClosingCertificatesService = inject(DcClosingCertificatesService)
  protected httpService = inject(DcHttpService)

  stepChange = output<number>()

  loadTemplate(item: DcFillClosingCertificateTemplateData) {
    this.dcClosingCertificatesService.buildTemplate(item, false)
  }

  isAllConfirmed = signal(false)

  prevStep() {
    this.dcClosingCertificatesService.changeConfirmOfTemplates(false)
    this.stepChange.emit(1)
  }
  confirmTemplate(certificate: DcFillClosingCertificateTemplateData) {
    certificate.confirmed = true
    setTimeout(() => {
      this.isAllConfirmed.set(
        this.dcClosingCertificatesService.isEveryConfirmed(
          this.dcClosingCertificatesService.fillClosingCertificateTemplateData() || []
        )
      )
    })
  }
  confirmAll() {
    this.dcClosingCertificatesService.changeConfirmOfTemplates(true)
    setTimeout(() => {
      this.isAllConfirmed.set(
        this.dcClosingCertificatesService.isEveryConfirmed(
          this.dcClosingCertificatesService.fillClosingCertificateTemplateData() || []
        )
      )
    })
  }
}
