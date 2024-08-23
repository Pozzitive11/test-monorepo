import { Component, inject, OnInit, TemplateRef } from '@angular/core'
import { PpHttpClientService } from '../../../features/purpose-payments/services/pp-http-client.service'
import { MessageHandlingService } from '../../services/message-handling.service'
import { UtilFunctions } from '../../utils/util.functions'
import { AuthService } from '../../../core/services/auth.service'
import { NgbOffcanvas, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { AsepUserFilesInfoComponent } from '../asep-user-files-info/asep-user-files-info.component'
import { NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbTooltip,
    AsepUserFilesInfoComponent
  ]
})
export class AccountInfoComponent implements OnInit {
  userFiles: string[] = []
  private http = inject(PpHttpClientService)
  private messageService = inject(MessageHandlingService)
  private authService = inject(AuthService)
  private offcanvasService = inject(NgbOffcanvas)

  get username() {
    return this.authService.loadedUser?.username
  }

  ngOnInit(): void {
    this.updateFiles()
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(
      content,
      {
        ariaLabelledBy: 'offcanvas-basic-title',
        scroll: true,
        position: 'end'
      }
    )
  }

  downloadFile(filename: string) {
    this.http.requestFile(filename)
      .subscribe({
        next: (fileBinary) => UtilFunctions.downloadXlsx(fileBinary, filename, null),
        error: (err) => this.messageService.sendError(err.error.detail)
      })
  }

  removeFile(filename: string) {
    this.http.deleteFile(filename)
      .subscribe({
        next: (value) => this.messageService.sendInfo(value.description),
        error: (err) => this.messageService.sendError(err.error.detail),
        complete: () => this.userFiles = this.userFiles.filter((file) => file !== filename)
      })
  }

  private updateFiles() {
    this.http.getUserFiles()
      .subscribe({
        next: (filesList) => this.userFiles = filesList.data,
        error: (err) => this.messageService.sendError(err.error.detail)
      })
  }
}
