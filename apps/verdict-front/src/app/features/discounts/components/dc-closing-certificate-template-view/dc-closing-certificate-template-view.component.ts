import { ChangeDetectionStrategy, Component, TemplateRef, inject, signal } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DcClosingCertificatesService } from '../../services/dc-closing-certificates.service'
import { DcFillClosingCertificateTemplateData } from '../../models/dc-closing-certificates'
import { CommonModule, NgIf } from '@angular/common'
import { DcClosingCertificateCardComponent } from '../dc-closing-certificate-card/dc-closing-certificate-card.component'
import { DcClosingCertificatePdfViewComponent } from '../dc-closing-certificate-pdf-view/dc-closing-certificate-pdf-view.component'
import { DcClosingCertificateTableComponent } from '../../components/dc-closing-certificate-table/dc-closing-certificate-table.component'

@Component({
  selector: 'app-dc-closing-certificate-template-view',
  standalone: true,
  imports: [
    NgIf,
    DcClosingCertificateCardComponent,
    CommonModule,
    DcClosingCertificatePdfViewComponent,
    DcClosingCertificateTableComponent
  ],
  templateUrl: './dc-closing-certificate-template-view.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcClosingCertificateTemplateViewComponent {
  protected dcClosingCertificatesService = inject(DcClosingCertificatesService)
  private modalService = inject(NgbModal)
  isAllConfirmed = signal(false)

  open(content: TemplateRef<any>) {
    this.dcClosingCertificatesService.getFillClosingCertificateTemplateData()
    this.modalService.open(content, {
      fullscreen: true
    })
  }
  closeModal(content: any) {
    content.dismiss('Cross click')
    this.dcClosingCertificatesService.fillClosingCertificateTemplateData.set(null)
    this.dcClosingCertificatesService.changedClosingCertificateTemplates.set(null)
    this.dcClosingCertificatesService.step.set(1)
  }

  confirmDocument(event: DcFillClosingCertificateTemplateData[]) {
    this.dcClosingCertificatesService.fillClosingCertificateTemplateData.set(event)
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
  nextStep() {
    this.dcClosingCertificatesService.changeConfirmOfTemplates(false)
    this.dcClosingCertificatesService.step.set(2)
    this.isAllConfirmed.set(false)
  }

  prevStep(step: number) {
    this.dcClosingCertificatesService.step.set(step)
    this.isAllConfirmed.set(false)
  }
}
