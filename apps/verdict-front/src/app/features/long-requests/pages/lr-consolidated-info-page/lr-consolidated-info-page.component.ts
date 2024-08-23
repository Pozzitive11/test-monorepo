import { Component, inject } from '@angular/core'
import { LrHttpService } from '../../services/lr-http.service'
import { Observable } from 'rxjs'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { SwitchCheckboxComponent } from '../../../../shared/components/switch-checkbox/switch-checkbox.component'
import { FormsModule } from '@angular/forms'
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component'
import { NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-lr-consolidated-info-page',
  templateUrl: './lr-consolidated-info-page.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgbProgressbar,
    FileUploadComponent,
    NgbTooltip,
    FormsModule,
    SwitchCheckboxComponent
  ]
})
export class LrConsolidatedInfoPageComponent {
  private readonly httpService = inject(LrHttpService)
  private readonly messageService = inject(MessageHandlingService)

  readonly backUpTooltip = 'Більш швидке формування файлу, але файл не містить інформацію про платежі за сьогодні'

  contractIdsField: string = ''
  loading: boolean = false
  bankruptcy: boolean = false
  file: File | null = null
  backUpInfo: boolean = false

  selectFile(fileList: FileList | null) {
    if (!fileList)
      this.file = fileList
    else
      this.file = fileList[0]
  }

  clearFile() {
    this.file = null
  }

  consolidateInfo() {
    this.loading = true

    let fileWaiter: Observable<Blob>
    if (this.file) {
      const formData = new FormData()
      formData.append('file', this.file)
      fileWaiter = this.httpService.consolidateInfoFromFile(formData, this.bankruptcy, this.backUpInfo)
      this.file = null
    } else {
      const contractIdsList = this.contractIdsField.match(/\d+/g) || []
      fileWaiter = this.httpService.consolidateInfoFromList(contractIdsList, this.bankruptcy, this.backUpInfo)
    }

    fileWaiter.subscribe({
      next: (file) => UtilFunctions.downloadXlsx(file, 'Консолідована інфо', 'dmY'),
      error: async error => {
        this.messageService.sendError(
          'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
        )
        this.loading = false
      },
      complete: () => this.loading = false
    })

  }
}
