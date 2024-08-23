import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { PpHttpClientService } from '../../services/pp-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { PpFileProcessingService } from '../../services/pp-file-processing.service'
import { Subscription } from 'rxjs'
import { PaymentsProcessingInfo } from '../../../../data-models/server-data.model'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { ProcessTypes } from '../../models/process-types'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbProgressbar
} from '@ng-bootstrap/ng-bootstrap'
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component'
import { NgFor, NgIf } from '@angular/common'


@Component({
  selector: 'pp-processing-page',
  templateUrl: './pp-processing-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    FileUploadComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgFor,
    NgbDropdownItem,
    NgbProgressbar,
    LoadingSpinnerComponent
  ]
})
export class PpProcessingPageComponent implements OnInit, OnDestroy {
  private http = inject(PpHttpClientService)
  private messageService = inject(MessageHandlingService)
  private processPaymentsService = inject(PpFileProcessingService)

  disabled: boolean = false
  progressUpdates?: Subscription
  progressInfo?: PaymentsProcessingInfo
  waiting = false
  fileList: FileList | null = null
  readonly types: string[] = [
    ProcessTypes.NKS,
  ]
  currentType: string = ProcessTypes.NKS

  ngOnInit(): void {
    this.progressInfo = this.processPaymentsService.lastProgressInfo

    this.subscribeToUpdates()
  }

  ngOnDestroy() {
    this.progressUpdates?.unsubscribe()
  }

  updateCurrentType(type: string) {
    this.currentType = type
  }

  startProcessing() {
    if (this.fileList) {
      this.progressInfo = undefined
      this.waiting = true

      const file: File = this.fileList[0]

      const formData = new FormData()
      formData.append('file', file)

      this.http.startPaymentsProcessing(formData, this.currentType)
        .subscribe({
          next: (data) => { this.messageService.sendInfo(data.description) },
          error: (error) => {
            this.messageService.sendError(`${error.status}: ${error.error.detail}`)
            this.waiting = false
          },
          complete: () => {
            this.disabled = true
            this.processPaymentsService.processPaymentsProgress()
            this.waiting = false
          }
        })
    }
  }

  requestFile() {
    if (this.progressInfo?.end_file) {
      this.http.requestFile(this.progressInfo?.end_file).subscribe({
        next: file => this.downloadFile(file),
        error: err => { this.messageService.sendError(err.error.detail) },
        complete: () => { }
      })
    }
  }

  private subscribeToUpdates() {
    this.progressUpdates = this.processPaymentsService.progressUpdate
      .subscribe({
        next: (last_update) => {
          this.disabled = true
          this.progressInfo = last_update
          if (last_update.status.includes('Завершено')) {
            this.progressInfo?.end_file ? this.disabled = false : null
            this.disabled = false
            this.fileList = null
          }
        },
        error: err => { this.messageService.sendError(err.error.detail) }
      })
  }

  private downloadFile(file: Blob) {
    const filename = this.progressInfo?.end_file ? this.progressInfo.end_file : ''
    UtilFunctions.downloadXlsx(file, filename)
  }
}
