import { Component, inject, Input } from '@angular/core'
import { DcHttpService } from '../../../../services/dc-http.service'
import { MessageHandlingService } from '../../../../../../shared/services/message-handling.service'
import { DcMilitaryDocsDataService } from '../../../../services/dc-military-docs-data.service'
import { ShortTextPipe } from '../../../../../../shared/pipes/short-text.pipe'
import { FileUploadComponent } from '../../../../../../shared/components/file-upload/file-upload.component'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'


@Component({
  selector: 'dcm-docs-upload-cell',
  templateUrl: './dcm-docs-upload-cell.component.html',
  standalone: true,
  imports: [NgIf, NgbProgressbar, FileUploadComponent, NgFor, ShortTextPipe]
})
export class DcmDocsUploadCellComponent {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly militaryDocsDataService = inject(DcMilitaryDocsDataService)

  @Input() INN: string = ''

  loading: boolean = false
  shown: boolean = false
  selectedFiles: File[] = []

  selectFiles(fileList: FileList | null): void {
    if (fileList) {
      this.selectedFiles = []
      for (let i = 0; i < fileList.length; i++)
        this.selectedFiles.push(fileList[i])
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1)
  }

  uploadFiles() {
    if (this.selectedFiles) {
      this.loading = true
      for (let file of this.selectedFiles) {
        const formData = new FormData()

        formData.append('file', file, file.name)
        this.httpService.uploadMilitaryUnitResponse(formData, this.INN)
          .subscribe({
            next: (data) => {
              const reqIds = this.militaryDocsDataService.tableData
                .filter(val => val['ІПН'] === this.INN)
                .map(val => val['RequestId'])

              for (let id of reqIds) {
                const index = this.militaryDocsDataService.tableData.map(val => val['RequestId']).indexOf(id)
                this.militaryDocsDataService.tableData[index]['Шлях збереження відповіді з в/ч'] = data.description
                this.militaryDocsDataService.filterData()
              }
            },
            error: err => {
              this.messageService.sendError(`${err.status}: ${err.error.detail}`)
              this.loading = false
            },
            complete: () => this.loading = false
          })
      }
    }
    this.shown = false
    this.selectedFiles = []

  }

  canUpload(): boolean {
    return this.selectedFiles.length === 0
  }

}
