import { Component, inject, Input } from '@angular/core'
import { ProcessInfoModel } from '../../../../data-models/server-data.model'
import { MessageHandlingService } from '../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../shared/utils/util.functions'
import { PpFiltersService } from '../../services/pp-filters.service'
import { PpHttpClientService } from '../../services/pp-http-client.service'
import { PpRowMarksService } from '../../services/pp-row-marks.service'
import { PpTableDataService } from '../../services/pp-table-data.service'
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component'
import { NgIf } from '@angular/common'


@Component({
  selector: 'app-payment-split',
  templateUrl: './payment-split.component.html',
  standalone: true,
  imports: [NgIf, LoadingSpinnerComponent]
})
export class PaymentSplitComponent {
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly dataService = inject(PpTableDataService)
  private readonly selectedRowsService = inject(PpRowMarksService)
  private readonly filtersService = inject(PpFiltersService)

  @Input() id: string = ''
  @Input() type: 'download' | 'upload' = 'download'
  loading: boolean = false

  downloadRow() {
    this.loading = true
    let selectedIds = this.selectedRowsService.listNoAll(this.filtersService.hideIds)
    if (!selectedIds.includes(this.id))
      selectedIds = [this.id]

    this.httpService.getFileWithSelectedIds(selectedIds, this.dataService.processType).subscribe({
      next: (file) => UtilFunctions.downloadXlsx(file, 'split'),
      error: (error) => {
        this.messageService.sendError(error.error.detail)
        this.loading = false
      },
      complete: () => this.loading = false
    })
  }

  onUploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement
    let fileList: FileList | null = element.files

    if (fileList) {
      this.loading = true
      const file: File = fileList[0]
      let formData = new FormData()
      formData.append('file', file)

      this.httpService.sendPaymentsSplit(formData, this.dataService.processType)
        .subscribe({
          next: (data) => { this.processSplitting(data) },
          error: (error) => {
            this.messageService.sendError(`${error.status}: ${error.error.detail}`)
            this.loading = false
          },
          complete: () => { this.loading = false }
        })
    }
  }

  processSplitting(data: ProcessInfoModel) {
    for (let info of data.info)
      this.messageService.sendInfo(info)

    for (let error of data.errors)
      this.messageService.sendError(error)

    this.dataService.uploadData(
      this.filtersService.chosen_files,
      UtilFunctions.formatNgbDate(this.filtersService.fromDate()),
      UtilFunctions.formatNgbDate(this.filtersService.toDate()),
      this.filtersService.bufferType
    )
  }
}
