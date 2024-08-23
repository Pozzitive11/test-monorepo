import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core'
import { PaymentDocModel } from '../../../models/payment-doc.model'
import { NgbModal, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { PpHttpClientService } from '../../../services/pp-http-client.service'
import { BehaviorSubject } from 'rxjs'
import { MessageHandlingService } from '../../../../../shared/services/message-handling.service'
import { UtilFunctions } from '../../../../../shared/utils/util.functions'
import { PpTableDataService } from '../../../services/pp-table-data.service'
import { DictionaryFullModel } from '../../../../../shared/models/dictionary-full.model'
import { unsecuredCopyToClipboard } from '../../../../../shared/utils/unsave-clipboard.util'
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component'
import { DefaultDropdownComponent } from '../../../../../shared/components/default-dropdown/default-dropdown.component'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'


@Component({
  selector: 'pp-docs-cell',
  templateUrl: './pp-docs-cell.component.html',
  standalone: true,
  imports: [NgbTooltip, NgIf, NgbProgressbar, NgFor, DefaultDropdownComponent, FileUploadComponent, AsyncPipe]
})
export class PpDocsCellComponent implements OnChanges {
  readonly modalService = inject(NgbModal)
  private readonly httpService = inject(PpHttpClientService)
  private readonly messageService = inject(MessageHandlingService)
  private readonly dataService = inject(PpTableDataService)

  readonly PAYMENT_DOC_TYPES = [
    'Акт',
    'Рахунок',
    'Зарплатна відомість',
    'Заява'
  ]

  @Input() row: string = '_'
  @Input() value: PaymentDocModel[] = []

  @Output() valueChange = new EventEmitter<PaymentDocModel[]>()

  valueInEdit: PaymentDocModel[] = []
  oldValueHandler: PaymentDocModel[] = []

  newLoadedDocs: { file: File, docType: string }[] = []

  loading$ = new BehaviorSubject(false)

  get tooltip(): string {
    return this.value.length === 0 ? 'Додати документ' : 'Редагувати документи'
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.valueInEdit = this.value.map(doc => ({ ...doc }))
  }

  openModal(content: TemplateRef<any>) {
    this.oldValueHandler = this.valueInEdit.map(doc => ({ ...doc }))

    this.modalService.open(content, { centered: true, size: 'lg' }).result
      .then(
        () => {
          this.value = this.valueInEdit.map(doc => ({ ...doc }))
          this.valueChange.emit(this.value)
        },
        () => {
          if (this.oldValueHandler.length)
            this.valueInEdit = this.oldValueHandler.map(doc => ({ ...doc }))
          this.oldValueHandler = []
        }
      )
  }

  downloadFile(docPath: string) {
    this.loading$.next(true)

    this.httpService.downloadPaymentDoc(docPath)
      .subscribe({
        next: (res) => {
          try {
            UtilFunctions.saveFileFromHttp(res, true)
          } catch (e) {
            this.messageService.sendError(`Виникла помилка: ${e}`)
          }
        },
        error: async error => {
          this.messageService.sendError(
            'Не вдалося завантажити файл із серверу: ' + JSON.parse(await error.error.text()).detail
          )
          this.loading$.next(false)
        },
        complete: () => this.loading$.next(false)
      })
  }

  copyPath(docPath: string) {
    navigator.clipboard.writeText(docPath)
      .catch(() => unsecuredCopyToClipboard(docPath))
  }

  addFiles(newFiles: FileList | null) {
    if (newFiles)
      for (let i = 0; i < newFiles.length; i++)
        this.newLoadedDocs.push({ file: newFiles[i], docType: '' })
  }

  uploadFiles() {
    if (!this.newLoadedDocs.length)
      return

    this.loading$.next(true)

    const formData = new FormData()
    for (let file of this.newLoadedDocs)
      formData.append('files', file.file, file.file.name)

    const docTypes = this.newLoadedDocs.map(doc => doc.docType)

    const fullRow = this.dataService.getRow(this.row)
    if (!fullRow) {
      this.messageService.sendError('Не вдалося отримати повну інформацію про рядок')
      this.loading$.next(false)
      return
    }

    const business: DictionaryFullModel | undefined = fullRow['Центр фінансування']
    const project: DictionaryFullModel | undefined = fullRow['Проєкт']
    const spendingTypeParent: DictionaryFullModel | undefined = fullRow['Батьківська стаття затрат']
    const spendingType: DictionaryFullModel | undefined = fullRow['Стаття затрат']

    if (!business || !project || !spendingTypeParent || !spendingType) {
      this.messageService.sendError(
        'Не заповнена необхідна інформація про платіж (' + [
          business ? '' : 'центр фінансування',
          project ? '' : 'проєкт',
          spendingTypeParent ? '' : 'батьківська стаття затрат',
          spendingType ? '' : 'стаття затрат'
        ].filter(name => !!name).join(', ') + ')'
      )
      this.loading$.next(false)
      return
    }

    this.httpService.uploadPaymentDocs(
      formData, docTypes, this.row,
      business.Name, project.Name, spendingTypeParent.Name, spendingType.Name
    ).subscribe({
      next: (uploadedDocs) => {
        this.value.push(...uploadedDocs)
        this.valueInEdit = this.value.map(doc => ({ ...doc }))
        this.valueChange.emit(this.value)
        this.messageService.sendInfo('Документи успішно завантажено')
        this.oldValueHandler = []
        this.newLoadedDocs = []
      },
      error: (err) => {
        this.messageService.sendError(err.error.detail)
        this.loading$.next(false)
      },
      complete: () => this.loading$.next(false)
    })
  }

  canBeUploaded() {
    return this.newLoadedDocs.length > 0 && this.newLoadedDocs.every(doc => doc.docType)
  }
}
