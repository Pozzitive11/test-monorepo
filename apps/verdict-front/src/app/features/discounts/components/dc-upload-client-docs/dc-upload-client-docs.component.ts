import { Component, inject } from '@angular/core'
import { DcHttpService } from '../../services/dc-http.service'
import { DcOtherDocsUploadComponent } from '../dc-other-docs-upload/dc-other-docs-upload.component'
import { DcmDocUploadComponent } from '../dc-military/dcm-doc-upload/dcm-doc-upload.component'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'

@Component({
  selector: 'dc-upload-client-docs',
  templateUrl: './dc-upload-client-docs.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    DcmDocUploadComponent,
    DcOtherDocsUploadComponent
  ]
})
export class DcUploadClientDocsComponent {
  private readonly httpService = inject(DcHttpService)

  clientINN?: string
  clientName?: string
  showDocUpload: boolean = false

  checkClient() {
    if (this.clientINN) {
      this.httpService.getClientName(this.clientINN)
        .subscribe({
          next: value => this.clientName = value,
          error: () => delete this.clientName
        })
    }
  }

}
