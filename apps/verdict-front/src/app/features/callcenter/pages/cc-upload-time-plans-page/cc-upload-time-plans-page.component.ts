import { Component, inject, OnInit } from '@angular/core'
import { CcHttpClientService } from '../../services/cc-http-client.service'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { PlansInfoModel } from '../../models/report-models'
import { FormsModule } from '@angular/forms'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import { NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'cc-upload-time-plans-page',
  templateUrl: './cc-upload-time-plans-page.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgbTooltip,
    NgIf,
    LoadingSpinnerComponent,
    NgbProgressbar,
    FormsModule,
    NgFor,
    DecimalPipe
  ]
})
export class CcUploadTimePlansPageComponent implements OnInit {
  private httpService = inject(CcHttpClientService)
  private messageService = inject(MessageHandlingService)

  loading: boolean = false
  disabled: boolean = false
  private currentPlans: PlansInfoModel[] = []
  updating: boolean = false

  filter: string = ''

  ngOnInit(): void {
    this.updating = true
    this.getTimePlans()
  }

  get plans() {
    if (this.filter)
      return this.currentPlans.filter(value => value.ProjectName.toLowerCase().includes(this.filter.toLowerCase()))
    else
      return this.currentPlans
  }

  onUploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files

    if (fileList) {
      this.loading = true

      const file: File = fileList[0]
      const filename = file.name
      if (!filename.includes('.xlsx')) {
        this.messageService.sendError('Невірний формат файлу. Необхідний файл з програми Excel з розширенням *.xlsx')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      this.httpService.uploadTimePlans(formData)
        .subscribe({
          next: (data) => {
            this.messageService.sendInfo(data.description)
            this.loading = false
            this.updating = true
            this.getTimePlans()
          },
          error: err => {
            this.messageService.sendError(`${err.status}: ${err.error.detail}`)
            this.loading = false
          }
        })

    }
  }

  filterChanged() {

  }

  private getTimePlans() {
    this.httpService.getTimePlans()
      .subscribe({
        next: value => {
          this.currentPlans = value
          this.updating = false
        },
        error: err => {
          this.messageService.sendError(`${err.status}: ${err.error.detail}`)
          this.updating = false
        }
      })
  }

}









