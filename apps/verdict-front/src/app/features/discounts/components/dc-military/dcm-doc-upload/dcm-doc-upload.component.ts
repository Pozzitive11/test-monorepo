import { Component, inject, Input, OnInit } from '@angular/core'
import { DcHttpService } from '../../../services/dc-http.service'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { DcDataService } from '../../../services/dc-data.service'
import { ShortTextPipe } from '../../../../../shared/pipes/short-text.pipe'
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbProgressbar
} from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

interface DocType {
  id: number
  name: string
}

@Component({
  selector: 'dcm-doc-upload',
  templateUrl: './dcm-doc-upload.component.html',
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
    ShortTextPipe
  ]
})
export class DcmDocUploadComponent implements OnInit {
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly dataService = inject(DcDataService)

  @Input() INN: string = ''

  docTypes: DocType[] = []
  loading: boolean = false
  selectedFiles: { file: File; docType?: DocType }[] = []

  get shown() {
    return this.dataService.shownDocUploadType.military
  }

  set shown(value) {
    this.dataService.shownDocUploadType.military = value
    if (value) this.dataService.shownDocUploadType.other = false
    this.dataService.shownDocUploadType.identification = false
  }

  ngOnInit(): void {
    this.httpService.getMilitaryDocTypes(false).subscribe({
      next: (value) => (this.docTypes = value)
    })
  }

  selectFiles(fileList: FileList | null): void {
    if (fileList) for (let i = 0; i < fileList.length; i++) this.selectedFiles.push({ file: fileList[i] })
  }

  uploadFiles() {
    // if (this.selectedFiles) {
    //   const filesSent = this.selectedFiles.length
    //   let filesSaved: number = 0

    //   this.loading = true
    //   for (let file of this.selectedFiles) {
    //     const formData = new FormData()

    //     formData.append('file', file.file, file.file.name)
    //     this.httpService.uploadMilitaryDoc(formData, this.INN, file.docType ? file.docType.id : 'NULL').subscribe({
    //       next: (data) => {
    //         this.messageService.sendInfo(data.description)
    //         filesSaved++
    //       },
    //       error: (err) => {
    //         this.messageService.sendError(`${err.status}: ${err.error.detail}`)
    //         this.loading = false
    //       },
    //       complete: () => {
    //         if (filesSaved === filesSent) {
    //           this.loading = false
    //           this.dataService.getScoreModel()
    //         }
    //       }
    //     })
    //   }
    // }
    this.shown = false
    this.selectedFiles = []
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1)
  }

  canUploadMilitaryDocs(): boolean {
    return this.selectedFiles.length === 0 || this.selectedFiles.some((value) => !value.docType)
  }
}
