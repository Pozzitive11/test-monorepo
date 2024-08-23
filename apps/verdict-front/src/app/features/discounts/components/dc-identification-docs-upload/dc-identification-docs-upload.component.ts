import { Component, inject, Input, TemplateRef } from '@angular/core'
import { DcHttpService } from '../../services/dc-http.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { DcDataService } from '../../services/dc-data.service'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbProgressbar
} from '@ng-bootstrap/ng-bootstrap'
import { ShortTextPipe } from '../../../../shared/pipes/short-text.pipe'
import { FormsModule } from '@angular/forms'
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component'
import { NgFor, NgIf } from '@angular/common'

interface DocType {
  id: number
  name: string
}

@Component({
  selector: 'app-dc-identification-docs-upload',
  templateUrl: './dc-identification-docs-upload.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    FileUploadComponent,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    FormsModule,
    ShortTextPipe
  ]
})
export class DcIdentificationDocsUploadComponent {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly dataService = inject(DcDataService)
  private readonly modalService = inject(NgbModal)

  @Input() INN: string = ''

  docTypeName: string = ''
  loading: boolean = false
  selectedFiles: { comment: string; file: File, docType?: DocType }[] = []

  get docTypes(): DocType[] { return this.dataService.identificationDocTypes }

  get shown() { return this.dataService.shownDocUploadType.identification }

  set shown(value) {
    this.dataService.shownDocUploadType.identification = value
    if (value)
      this.dataService.shownDocUploadType.military = false
    this.dataService.shownDocUploadType.other = false
  }

  selectFiles(fileList: FileList | null): void {
    if (fileList)
      for (let i = 0; i < fileList.length; i++)
        this.selectedFiles.push({ file: fileList[i], comment: '' })
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1)
  }

  uploadFiles() {
    if (this.selectedFiles) {
      const filesSent = this.selectedFiles.length
      let filesSaved: number = 0

      this.loading = true
      for (let file of this.selectedFiles) {
        const formData = new FormData()

        formData.append('file', file.file, file.file.name)
        const docType = file.docType ? (file.docType.name === 'Інше' ? file.comment : file.docType.name) : ''
        this.httpService.uploadOtherDocs_Identi(formData, this.INN, docType)
          .subscribe({
            next: (data) => {
              this.messageService.sendInfo(data.description)
              filesSaved++
            },
            error: err => {
              this.messageService.sendError(`${err.status}: ${err.error.detail}`)
              this.loading = false
            },
            complete: () => {
              if (filesSaved === filesSent) {
                this.loading = false
                this.dataService.getScoreModel()
              }
            }
          })
      }
    }
    this.shown = false
    this.selectedFiles = []

  }

  canUpload(): boolean {
    return this.selectedFiles.length === 0 || this.selectedFiles.some(value => !this.validDocType(value))
  }

  validDocType(file: { comment: string; file: File; docType?: DocType }) {
    if (!file.docType)
      return false
    return file.docType.name === 'Інше' ? !!file.comment : true
  }

  setDocType(content: TemplateRef<any>, file: { comment: string; file: File; docType?: DocType }, docType: DocType) {
    if (docType.name === 'Інше') {
      this.docTypeName = ''
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        () => {
          if (this.docTypeName) {
            file.docType = docType
            file.comment = this.docTypeName
          }
        },
        () => {}
      )
    } else
      file.docType = docType

  }

}
