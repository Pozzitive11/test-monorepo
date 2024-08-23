import { Component, inject, Input, OnInit } from '@angular/core'
import { DcMilitaryDocsDataService } from '../../../../services/dc-military-docs-data.service'
import { DcDataService } from '../../../../services/dc-data.service'
import { DcHttpService } from '../../../../services/dc-http.service'
import { MessageHandlingService } from '../../../../../../shared/services/message-handling.service'
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap'
import { NgFor, NgIf } from '@angular/common'

interface DocType {
  id: number
  name: string
}

@Component({
  selector: 'dcm-docs-type-cell',
  templateUrl: './dcm-docs-type-cell.component.html',
  standalone: true,
  imports: [NgFor, NgbDropdown, NgbTooltip, NgbDropdownToggle, NgIf, NgbDropdownMenu, NgbDropdownItem]
})
export class DcmDocsTypeCellComponent implements OnInit {
  private readonly dataService = inject(DcMilitaryDocsDataService)
  private readonly discountsDataService = inject(DcDataService)
  private readonly httpService = inject(DcHttpService)
  private readonly messageService = inject(MessageHandlingService)

  @Input() col: string = ''
  @Input() rows: number[] = []
  @Input() value: { [key: string]: any }[] = []

  docTypes: DocType[] = []

  get otherDocTypes(): DocType[] {
    return this.discountsDataService.otherDocTypes
  }

  ngOnInit(): void {
    this.httpService.getMilitaryDocTypes(false).subscribe({
      next: (value) => (this.docTypes = value)
    })
  }

  copy(text: string, copyThing: HTMLElement) {
    copyThing.classList.remove('bi-clipboard2')
    copyThing.classList.add('bi-clipboard2-check')
    navigator.clipboard.writeText(text).then(() =>
      setTimeout(() => {
        copyThing.classList.remove('bi-clipboard2-check')
        copyThing.classList.add('bi-clipboard2')
      }, 2_000)
    )
  }

  openLocation(filePath: string) {
    filePath = filePath.split(/[\\/]/).slice(0, -1).join('\\')
    window.open('file://///' + filePath)
  }

  isMilitaryDocs(docType: string) {
    return this.docTypes.map((val) => val.name).includes(docType)
  }

  docTypeEditable(docType: string) {
    return (
      docType === 'Інше' ||
      ![...this.docTypes.map((val) => val.name), ...this.otherDocTypes.map((val) => val.name)].includes(docType)
    )
  }

  changeDocType(row: { [p: string]: any }, docType: string) {
    if (docType === 'Інше') {
      row['Вид документу'] = ''
      return
    }
    if (row['Вид документу'] === docType) return
    if (!row['Вид документу']) {
      this.messageService.sendError('Необхідно вказати тип документу')
      return
    }

    row['Вид документу'] = docType
    if (this.isMilitaryDocs(docType)) {
      const docTypeId = this.docTypes.filter((val) => val.name === docType)[0].id
      this.httpService.changeDocType({ id: row['DocumentId'], docType: docTypeId }).subscribe()
    } else this.httpService.changeDocType({ id: row['DocumentId'], docType: docType }).subscribe()
  }

  deleteDoc(docId: number) {
    this.dataService.loading = true

    this.httpService.deleteClientDoc(docId).subscribe({
      next: (info) => {
        this.dataService.removeClientDoc(docId)
        this.messageService.sendInfo(info.description)
      },
      error: (err) => {
        this.dataService.loading = false
        this.messageService.sendError(err.error.detail)
      },
      complete: () => (this.dataService.loading = false)
    })
  }
}
